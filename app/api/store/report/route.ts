import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import client from "@/lib/prismadb1";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized: Login required." },
      { status: 401 }
    );
  }

  try {
    // Fetch stores in batches to avoid SQL parameter limit
    const BATCH_SIZE = 500;
    let allStores: any[] = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await client.store.findMany({
        select: {
          id: true,
          pelak: true,
          name: true,
          username: true,
          password: true,
          metraj: true,
          ejareh: true,
          tel1: true,
          tel2: true,
          active: true,
          aghsat: true,
          tajmi: true,
          malekiyat: true,
          tovzeh: true,
          cposti: true,
          changedate: true,
          Tahvil: true,
          rahro: true,
          bazar: true,
          nov: true,
          tabagh: true,
          chargeProfile: true,
        },
        orderBy: {
          pelak: "asc",
        },
        skip: skip,
        take: BATCH_SIZE,
      });

      if (batch.length === 0) {
        hasMore = false;
      } else {
        allStores = [...allStores, ...batch];
        skip += BATCH_SIZE;
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        }
      }
    }

    // Get all unique IDs for related data
    const pelaks = allStores.map(s => s.pelak);
    //@ts-ignore
    const chargeProfileIds = [...new Set(allStores.map(s => s.chargeProfile).filter(Boolean))];
    //@ts-ignore
    const rahroIds = [...new Set(allStores.map(s => s.rahro).filter(Boolean))];
    //@ts-ignore
    const bazarIds = [...new Set(allStores.map(s => s.bazar).filter(Boolean))];
    //@ts-ignore
    const novIds = [...new Set(allStores.map(s => s.nov).filter(Boolean))];
    //@ts-ignore
    const tabaghIds = [...new Set(allStores.map(s => s.tabagh).filter(Boolean))];

    // Fetch related data separately (batch IDs to avoid parameter limit)
    const [typesRahro, typesBazar, typesNov, typesTabagh, chargeDefs] = await Promise.all([
      rahroIds.length > 0 ? client.types_rahro.findMany({ where: { id: { in: rahroIds } }, select: { id: true, rahro: true } }) : [],
      bazarIds.length > 0 ? client.types_bazar.findMany({ where: { id: { in: bazarIds } }, select: { id: true, bazar: true } }) : [],
      novIds.length > 0 ? client.types_nov.findMany({ where: { id: { in: novIds } }, select: { id: true, nov: true } }) : [],
      tabaghIds.length > 0 ? client.types_tabagh.findMany({ where: { id: { in: tabaghIds } }, select: { id: true, tabagh: true } }) : [],
      chargeProfileIds.length > 0 ? client.chargeDef.findMany({ where: { id: { in: chargeProfileIds } }, select: { id: true, name: true, charge: true, type: true } }) : [],
    ]);

    // Batch fetch discounts and tenants to avoid parameter limit
    const DISCOUNT_BATCH_SIZE = 1000;
    let allDiscounts: any[] = [];
    for (let i = 0; i < pelaks.length; i += DISCOUNT_BATCH_SIZE) {
      const batchPelaks = pelaks.slice(i, i + DISCOUNT_BATCH_SIZE);
      const batch = await client.stores_discounts.findMany({
        where: { pelak: { in: batchPelaks } },
        select: {
          pelak: true,
          discountID: true,
          discountDef: { select: { name: true, discountPersand: true } },
        },
      });
      allDiscounts = [...allDiscounts, ...batch];
    }

    const TENANT_BATCH_SIZE = 1000;
    let allTenants: any[] = [];
    for (let i = 0; i < pelaks.length; i += TENANT_BATCH_SIZE) {
      const batchPelaks = pelaks.slice(i, i + TENANT_BATCH_SIZE);
      const batch = await client.tenant.findMany({
        where: { pelak: { in: batchPelaks } },
        select: {
          pelak: true,
          malekmos: true,
          trow: true,
          endate: true,
          tfname: true,
          tlname: true,
        },
        orderBy: { endate: 'desc' },
      });
      allTenants = [...allTenants, ...batch];
    }

    // Fetch all new_account records to calculate max deptPeriod per pelak
    const NEW_ACCOUNT_BATCH_SIZE = 1000;
    let allNewAccounts: any[] = [];
    for (let i = 0; i < pelaks.length; i += NEW_ACCOUNT_BATCH_SIZE) {
      const batchPelaks = pelaks.slice(i, i + NEW_ACCOUNT_BATCH_SIZE);
      const batch = await client.new_account.findMany({
        where: { pelak: { in: batchPelaks } },
        select: {
          pelak: true,
          deptPeriod: true,
        },
      });
      allNewAccounts = [...allNewAccounts, ...batch];
    }

    // Calculate max deptPeriod for each pelak
    const maxDeptPeriodMap = new Map<string, number | null>();
    allNewAccounts.forEach(acc => {
      const pelak = acc.pelak || '';
      const deptPeriod = acc.deptPeriod;
      if (!maxDeptPeriodMap.has(pelak)) {
        maxDeptPeriodMap.set(pelak, null);
      }
      const currentMax = maxDeptPeriodMap.get(pelak) ?? null;
      if (deptPeriod !== null && deptPeriod !== undefined) {
        if (currentMax === null || deptPeriod > currentMax) {
          maxDeptPeriodMap.set(pelak, deptPeriod);
        }
      }
    });

    // Create maps for quick lookup
    const rahroMap = new Map(typesRahro.map(t => [t.id, t.rahro]));
    const bazarMap = new Map(typesBazar.map(t => [t.id, t.bazar]));
    const novMap = new Map(typesNov.map(t => [t.id, t.nov]));
    const tabaghMap = new Map(typesTabagh.map(t => [t.id, t.tabagh]));
    const chargeDefMap = new Map(chargeDefs.map(c => [c.id, c]));
    const discountsMap = new Map<string, typeof allDiscounts>();
    allDiscounts.forEach(d => {
      if (!discountsMap.has(d.pelak || '')) {
        discountsMap.set(d.pelak || '', []);
      }
      discountsMap.get(d.pelak || '')?.push(d);
    });
    const tenantsMap = new Map<string, typeof allTenants>();
    allTenants.forEach(t => {
      if (!tenantsMap.has(t.pelak || '')) {
        tenantsMap.set(t.pelak || '', []);
      }
      tenantsMap.get(t.pelak || '')?.push(t);
    });

    // Transform stores with related data
    const response = allStores.map(store => ({
      ...store,
      types_rahro: store.rahro ? { id: store.rahro, rahro: rahroMap.get(store.rahro) || null } : null,
      types_bazar: store.bazar ? { id: store.bazar, bazar: bazarMap.get(store.bazar) || null } : null,
      types_nov: store.nov ? { id: store.nov, nov: novMap.get(store.nov) || null } : null,
      types_tabagh: store.tabagh ? { id: store.tabagh, tabagh: tabaghMap.get(store.tabagh) || null } : null,
      chargeDef: store.chargeProfile ? chargeDefMap.get(store.chargeProfile) || null : null,
      stores_discounts: discountsMap.get(store.pelak) || [],
      Tenant: (tenantsMap.get(store.pelak) || []).slice(0, 1),
    }));

    // Transform data to flatten nested objects for easier filtering
    const transformedData = response.map((store) => {
      // Calculate tariff charge
      const tariffCharge = Number(store.chargeDef?.charge || 0);
      const tariffType = store.chargeDef?.type || "1";
      const metraj = Number(store.metraj || 0);
      const ejareh = Number(store.ejareh || 0);
      
      // Calculate discount percentage
      //@ts-ignore
      const discountPercent = store.stores_discounts?.reduce((sum, d) => {
        return sum + Number(d.discountDef?.discountPersand || 0);
      }, 0) || 0;
      
      // Calculate final charge
      let amount = 0;
      if (ejareh > 0) {
        amount = ejareh;
      } else if (tariffType === "2") {
        amount = tariffCharge;
      } else {
        amount = tariffCharge * metraj;
      }
      
      const discountAmount = (discountPercent / 100) * amount;
      const finalCharge = Math.round(amount - discountAmount);

      // Get active tenant
      const activeTenant = store.Tenant?.[0];
      
      // Get maximum deptPeriod from all new_account records for this store
      const maxDeptPeriod = maxDeptPeriodMap.get(store.pelak) ?? null;

      return {
        id: store.id,
        pelak: store.pelak,
        name: store.name || "",
        username: store.username || "",
        password: store.password || "",
        metraj: store.metraj || 0,
        maxDeptPeriod: maxDeptPeriod,
        ejareh: store.ejareh || 0,
        tel1: store.tel1 || "",
        tel2: store.tel2 || "",
        active: store.active ? "فعال" : "غیر فعال",
        activeRaw: store.active,
        aghsat: store.aghsat ? "اقساطی" : "نقدی",
        aghsatRaw: store.aghsat,
        tajmi: store.tajmi ? "بلی" : "خیر",
        tajmiRaw: store.tajmi,
        malekiyat: store.malekiyat ? "بلی" : "خیر",
        malekiyatRaw: store.malekiyat,
        tovzeh: store.tovzeh || "",
        cposti: store.cposti || "",
        changedate: store.changedate || "",
        Tahvil: store.Tahvil || "",
        rahro: store.types_rahro?.rahro || "",
        rahroId: store.types_rahro?.id,
        bazar: store.types_bazar?.bazar || "",
        bazarId: store.types_bazar?.id,
        nov: store.types_nov?.nov || "",
        novId: store.types_nov?.id,
        tabagh: store.types_tabagh?.tabagh || "",
        tabaghId: store.types_tabagh?.id,
        chargeDefName: store.chargeDef?.name || "",
        chargeDefCharge: store.chargeDef?.charge || 0,
        chargeDefType: store.chargeDef?.type || "",
        discountPercent: discountPercent,
        //@ts-ignore
        discountNames: store.stores_discounts?.map(d => d.discountDef?.name).filter(Boolean).join(", ") || "",
        finalCharge: finalCharge,
        tenantName: activeTenant ? `${activeTenant.tfname || ""} ${activeTenant.tlname || ""}`.trim() : "",
        tenantType: activeTenant?.malekmos === "1" ? "مالک" : activeTenant?.malekmos === "2" ? "مستاجر" : "",
        tenantEndDate: activeTenant?.endate || "",
      };
    });

    const res = JSON.parse(
      JSON.stringify(
        transformedData,
        (key, value) => (typeof value === "bigint" ? value.toString() : value)
      )
    );

    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    console.error("Store report error:", error.message);
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    );
  }
}

