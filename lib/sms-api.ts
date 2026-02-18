import axios from "axios";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

const SMS_API_URL = "http://185.112.33.61/webservice/send.php";

interface SmsCredentials {
  username: string;
  password: string;
}

interface SmsConfig extends SmsCredentials {
  fromNumber?: string;
  schoolName?: string;
  schoolCode?: string | null;
}

type SoapValue = string | string[];
type SoapParams = Record<string, SoapValue>;
type SoapResponse = string | string[] | null;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const decodeXmlEntities = (value: string): string =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const normalizeXmlValue = (value: string): string =>
  decodeXmlEntities(
    value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]*>/g, "")
      .trim(),
  );

const normalizeDomain = (domain: string): string => {
  const trimmed = domain.trim();
  if (!trimmed) return "";

  try {
    const hasProtocol =
      trimmed.startsWith("http://") || trimmed.startsWith("https://");
    const parsed = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    return parsed.hostname;
  } catch {
    return trimmed;
  }
};

const getFallbackSmsConfig = (): SmsConfig => ({
  username: process.env.SMS_ADMIN_USERNAME?.trim() || "majeedbanned",
  password: process.env.SMS_ADMIN_PASSWORD?.trim() || "6323905",
  fromNumber:
    process.env.SMS_FROM_NUMBER?.trim() ||
    process.env.SMS_ADMIN_FROM_NUMBER?.trim() ||
    undefined,
  schoolName: "admin-fallback",
});

async function getSmsConfig(
  domain: string,
  schoolCode?: string,
): Promise<SmsConfig> {
  try {
    const normalizedDomain = normalizeDomain(domain);
    const domainFilter: Prisma.users_mahdWhereInput = normalizedDomain
      ? {
          OR: [
            { domain: { contains: normalizedDomain } },
            { domdom: { contains: normalizedDomain } },
          ],
        }
      : {};

    let where: Prisma.users_mahdWhereInput;

    if (schoolCode) {
      where = {
        ...domainFilter,
        school_code: schoolCode,
      };
    } else {
      where = {
        ...domainFilter,
        active: true,
        sms_active: true,
        wsuser: { not: null },
        wspass: { not: null },
      };
    }

    const school = await prisma.users_mahd.findFirst({
      where,
      orderBy: {
        id: "asc",
      },
      select: {
        mahd_name: true,
        school_code: true,
        wsuser: true,
        wspass: true,
        sms_number: true,
      },
    });

    if (!school) {
      throw new Error(
        `No school found with SMS credentials for domain: ${domain}${schoolCode ? `, schoolCode: ${schoolCode}` : ""}`,
      );
    }

    const smsUsername = school.wsuser?.trim();
    const smsPassword = school.wspass?.trim();

    if (!smsUsername || !smsPassword) {
      throw new Error(
        `SMS credentials not configured for school: ${school.mahd_name || school.school_code || "Unknown"}`,
      );
    }

    logger.info(
      `Retrieved SMS credentials for school: ${school.mahd_name || school.school_code || "Unknown"}, domain: ${domain}`,
    );

    return {
      username: smsUsername,
      password: smsPassword,
      fromNumber: school.sms_number?.trim() || undefined,
      schoolName: school.mahd_name || undefined,
      schoolCode: school.school_code,
    };
  } catch (error) {
    logger.error("Error retrieving SMS credentials:", error);
    throw error;
  }
}

async function getSmsCredentials(
  domain: string,
  schoolCode?: string,
): Promise<SmsCredentials> {
  const config = await getSmsConfig(domain, schoolCode);
  return {
    username: config.username,
    password: config.password,
  };
}

const createSoapEnvelope = (method: string, params: SoapParams): string => {
  let paramsXml = "";

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      paramsXml += `<${key} xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="xsd:string[${value.length}]">`;
      value.forEach((item) => {
        paramsXml += `<item xsi:type="xsd:string">${escapeXml(item)}</item>`;
      });
      paramsXml += `</${key}>`;
    } else {
      paramsXml += `<${key} xsi:type="xsd:string">${escapeXml(value)}</${key}>`;
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
  <soap:Body>
    <${method} xmlns="urn:Send">
      ${paramsXml}
    </${method}>
  </soap:Body>
</soap:Envelope>`;
};

const parseSoapResponse = (xml: string): SoapResponse => {
  const returnMatch = xml.match(
    /<(?:[a-zA-Z0-9_]+:)?return\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?return>/i,
  );

  if (!returnMatch) return null;

  const returnContent = returnMatch[1];
  const itemMatches = Array.from(
    returnContent.matchAll(
      /<(?:[a-zA-Z0-9_]+:)?item\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?item>/gi,
    ),
  );

  if (itemMatches.length > 0) {
    return itemMatches.map((match) => normalizeXmlValue(match[1] || ""));
  }

  const singleValue = normalizeXmlValue(returnContent);
  return singleValue.length > 0 ? singleValue : null;
};

const makeSoapRequest = async (
  method: string,
  params: SoapParams,
): Promise<SoapResponse> => {
  try {
    const soapEnvelope = createSoapEnvelope(method, params);

    const response = await axios.post(SMS_API_URL, soapEnvelope, {
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: `urn:Send#${method}`,
      },
      timeout: 30000,
    });

    return parseSoapResponse(String(response.data));
  } catch (error) {
    logger.error(`Error in SOAP request for ${method}:`, error);
    throw error;
  }
};

export const smsApi = {
  getCredit: async (domain: string, schoolCode?: string): Promise<string | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("GetCredit", {
      Username: credentials.username,
      Password: credentials.password,
    }) as Promise<string | null>;
  },

  sendSMS: async (
    domain: string,
    fromNumber: string,
    toNumbers: string[],
    content: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("SendSMS", {
      fromNum: fromNumber,
      toNum: toNumbers,
      Content: content,
      Type: "1",
      Username: credentials.username,
      Password: credentials.password,
    }) as Promise<string[] | null>;
  },

  sendSMSAutoFrom: async (
    domain: string,
    toNumbers: string[],
    content: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    let config: SmsConfig;

    try {
      config = await getSmsConfig(domain, schoolCode);
    } catch (error) {
      logger.warn(
        "SMS credential lookup failed; using admin fallback credentials.",
        error,
      );
      config = getFallbackSmsConfig();
    }

    const fromNumber =
      config.fromNumber?.trim() ||
      process.env.SMS_FROM_NUMBER?.trim() ||
      process.env.SMS_ADMIN_FROM_NUMBER?.trim();

    if (!fromNumber) {
      throw new Error(
        `SMS sender number is not configured for school: ${config.schoolName || config.schoolCode || "Unknown"}. Set SMS_FROM_NUMBER in .env or configure users_mahd.sms_number.`,
      );
    }

    return makeSoapRequest("SendSMS", {
      fromNum: fromNumber,
      toNum: toNumbers,
      Content: content,
      Type: "1",
      Username: config.username,
      Password: config.password,
    }) as Promise<string[] | null>;
  },

  sendMultiSMS: async (
    domain: string,
    fromNumbers: string[],
    toNumbers: string[],
    contents: string[],
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("SendMultiSMS", {
      fromNum: fromNumbers,
      toNum: toNumbers,
      Content: contents,
      Type: ["1"],
      Username: credentials.username,
      Password: credentials.password,
    }) as Promise<string[] | null>;
  },

  sendToPhonebook: async (
    domain: string,
    fromNumber: string,
    phonebookId: string,
    content: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("SendOfPhoneBook", {
      fromNum: fromNumber,
      phonebook: phonebookId,
      Content: content,
      Type: "1",
      Username: credentials.username,
      Password: credentials.password,
    }) as Promise<string[] | null>;
  },

  listPhonebooks: async (
    domain: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("listPhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      Name: "",
    }) as Promise<string[] | null>;
  },

  getPhonebookNumbers: async (
    domain: string,
    bookId: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("numbersPhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      BookID: bookId,
    }) as Promise<string[] | null>;
  },

  addPhonebook: async (
    domain: string,
    name: string,
    numbers: string[],
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("AddPhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      Name: name,
      Numbers: numbers,
    }) as Promise<string[] | null>;
  },

  addToPhonebook: async (
    domain: string,
    phonebookId: string,
    numbers: string[],
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("AddToPhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      Phonebook: phonebookId,
      Numbers: numbers,
    }) as Promise<string[] | null>;
  },

  deleteNumbersFromPhonebook: async (
    domain: string,
    bookId: string,
    numbers: string[],
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("deleteNumbersOfPhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      BookID: bookId,
      Numbers: numbers,
    }) as Promise<string[] | null>;
  },

  deletePhonebook: async (
    domain: string,
    bookId: string,
    schoolCode?: string,
  ): Promise<string[] | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("deletePhonebook", {
      Username: credentials.username,
      Password: credentials.password,
      BookID: bookId,
    }) as Promise<string[] | null>;
  },

  getDetails: async (domain: string, schoolCode?: string): Promise<string | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("details", {
      Username: credentials.username,
      Password: credentials.password,
    }) as Promise<string | null>;
  },

  getStatus: async (
    domain: string,
    messageId: string,
    schoolCode?: string,
  ): Promise<string | null> => {
    const credentials = await getSmsCredentials(domain, schoolCode);
    return makeSoapRequest("GetStatus", {
      Username: credentials.username,
      Password: credentials.password,
      MessageID: messageId,
    }) as Promise<string | null>;
  },

  sendAdminSMS: async (
    fromNumber: string,
    toNumbers: string[],
    content: string,
  ): Promise<string[] | null> => {
    const adminCredentials: SmsCredentials = {
      username: "majeedbanned",
      password: "6323905",
    };

    return makeSoapRequest("SendSMS", {
      fromNum: fromNumber,
      toNum: toNumbers,
      Content: content,
      Type: "1",
      Username: adminCredentials.username,
      Password: adminCredentials.password,
    }) as Promise<string[] | null>;
  },
};
