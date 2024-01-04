package pl.motobudzet.api.vehicleBrand.brand_enumerated;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Brand {
    ABARTH(ModelABARTH.class, "ABARTH"),
//    ACURA(ModelACURA.class, "ACURA"),
//    AIWAYS(ModelAIWAYS.class, "AIWAYS"),
//    AIXAM(ModelAIXAM.class, "AIXAM"),
//    ALFA_ROMEO(ModelALFAROMEO.class, "ALFA ROMEO"),
//    ALPINE(ModelALPINE.class, "ALPINE"),
//    ASIA(ModelASIA.class, "ASIA"),
//    ASTON_MARTIN(ModelASTONMARTIN.class, "ASTON MARTIN"),
    AUDI(ModelAUDI.class, "AUDI"),
//    AUSTIN(ModelAUSTIN.class, "AUSTIN"),
//    BAIC(ModelBAIC.class, "BAIC"),
//    BENTLEY(ModelBENTLEY.class, "BENTLEY"),
    BMW(ModelBMW.class, "BMW");
//    BMW_ALPINA(ModelBMWALPINA.class, "BMW-ALPINA"),
//    BUICK(ModelBUICK.class, "BUICK"),
//    BYD(ModelBYD.class, "BYD"),
//    CADILLAC(ModelCADILLAC.class, "CADILLAC"),
//    CASALINI(ModelCASALINI.class, "CASALINI"),
//    CENNTRO(ModelCENNTRO.class, "CENNTRO"),
//    CHATENET(ModelCHATENET.class, "CHATENET"),
//    CHEVROLET(ModelCHEVROLET.class, "CHEVROLET"),
//    CHRYSLER(ModelCHRYSLER.class, "CHRYSLER"),
//    CUPRA(ModelCUPRA.class, "CUPRA"),
//    DACIA(ModelDACIA.class, "DACIA"),
//    DAEWOO(ModelDAEWOO.class, "DAEWOO"),
//    DAIHATSU(ModelDAIHATSU.class, "DAIHATSU"),
//    DELOREAN(ModelDELOREAN.class, "DELOREAN"),
//    DFSK(ModelDFSK.class, "DFSK"),
//    DKW(ModelDKW.class, "DKW"),
//    DODGE(ModelDODGE.class, "DODGE"),
//    DR_MOTOR(ModelDRMOTOR.class, "DR MOTOR"),
//    DS_AUTOMOBILES(ModelDSAUTOMOBILES.class, "DS AUTOMOBILES"),
//    FERRARI(ModelFERRARI.class, "FERRARI"),
//    FIAT(ModelFIAT.class, "FIAT"),
//    FORD(ModelFORD.class, "FORD"),
//    GAZ(ModelGAZ.class, "GAZ"),
//    GEELY(ModelGEELY.class, "GEELY"),
//    GENESIS(ModelGENESIS.class, "GENESIS"),
//    GMC(ModelGMC.class, "GMC"),
//    GWM(ModelGWM.class, "GWM"),
//    HONDA(ModelHONDA.class, "HONDA"),
//    HONGQI(ModelHONGQI.class, "HONGQI"),
//    HUMMER(ModelHUMMER.class, "HUMMER"),
//    HYUNDAI(ModelHYUNDAI.class, "HYUNDAI"),
//    INEOS(ModelINEOS.class, "INEOS"),
//    ISUZU(ModelISUZU.class, "ISUZU"),
//    IVECO(ModelIVECO.class, "IVECO"),
//    JAGUAR(ModelJAGUAR.class, "JAGUAR"),
//    JEEP(ModelJEEP.class, "JEEP"),
//    KIA(ModelKIA.class, "KIA"),
//    KTM(ModelKTM.class, "KTM"),
//    LADA(ModelLADA.class, "LADA"),
//    LAMBORGHINI(ModelLAMBORGHINI.class, "LAMBORGHINI"),
//    LANCIA(ModelLANCIA.class, "LANCIA"),
//    LEXUS(ModelLEXUS.class, "LEXUS"),
//    LIGIER(ModelLIGIER.class, "LIGIER"),
//    LINCOLN(ModelLINCOLN.class, "LINCOLN"),
//    LOTUS(ModelLOTUS.class, "LOTUS"),
//    MAN(ModelMAN.class, "MAN"),
//    MASERATI(ModelMASERATI.class, "MASERATI"),
//    MAXUS(ModelMAXUS.class, "MAXUS"),
//    MAYBACH(ModelMAYBACH.class, "MAYBACH"),
//    MAZDA(ModelMAZDA.class, "MAZDA"),
//    MCLAREN(ModelMCLAREN.class, "MCLAREN"),
//    MERCEDES(ModelMERCEDES.class, "MERCEDES"),
//    MERCURY(ModelMERCURY.class, "MERCURY"),
//    MG(ModelMG.class, "MG"),
//    MICROCAR(ModelMICROCAR.class, "MICROCAR"),
//    MINI(ModelMINI.class, "MINI"),
//    MITSUBISHI(ModelMITSUBISHI.class, "MITSUBISHI"),
//    NIO(ModelNIO.class, "NIO"),
//    NISSAN(ModelNISSAN.class, "NISSAN"),
//    NYSA(ModelNYSA.class, "NYSA"),
//    OLDSMOBILE(ModelOLDSMOBILE.class, "OLDSMOBILE"),
//    OPEL(ModelOPEL.class, "OPEL"),
//    PEUGEOT(ModelPEUGEOT.class, "PEUGEOT"),
//    PLYMOUTH(ModelPLYMOUTH.class, "PLYMOUTH"),
//    POLESTAR(ModelPOLESTAR.class, "POLESTAR"),
//    POLONEZ(ModelPOLONEZ.class, "POLONEZ"),
//    PONTIAC(ModelPONTIAC.class, "PONTIAC"),
//    PORSCHE(ModelPORSCHE.class, "PORSCHE"),
//    RAM(ModelRAM.class, "RAM"),
//    RENAULT(ModelRENAULT.class, "RENAULT"),
//    ROLLS_ROYCE(ModelROLLSROYCE.class, "ROLLS-ROYCE"),
//    LAND_ROVER(ModelLANDROVER.class, "LAND ROVER"),
//    SAAB(ModelSAAB.class, "SAAB"),
//    SEAT(ModelSEAT.class, "SEAT"),
//    SERES(ModelSERES.class, "SERES"),
//    SKODA(ModelSKODA.class, "SKODA"),
//    SMART(ModelSMART.class, "SMART"),
//    SSANGYONG(ModelSSANGYONG.class, "SSANGYONG"),
//    SUBARU(ModelSUBARU.class, "SUBARU"),
//    SUZUKI(ModelSUZUKI.class, "SUZUKI"),
//    SYRENA(ModelSYRENA.class, "SYRENA"),
//    TATA(ModelTATA.class, "TATA"),
//    TESLA(ModelTESLA.class, "TESLA"),
//    TOYOTA(ModelTOYOTA.class, "TOYOTA"),
//    TRABANT(ModelTRABANT.class, "TRABANT"),
//    TRIUMPH(ModelTRIUMPH.class, "TRIUMPH"),
//    UAZ(ModelUAZ.class, "UAZ"),
//    VAUXHALL(ModelVAUXHALL.class, "VAUXHALL"),
//    VOLKSWAGEN(ModelVOLKSWAGEN.class, "VOLKSWAGEN"),
//    VOLVO(ModelVOLVO.class, "VOLVO"),
//    WARSZAWA(ModelWARSZAWA.class, "WARSZAWA"),
//    WARTBURG(ModelWARTBURG.class, "WARTBURG"),
//    WOLGA(ModelWOLGA.class, "WOŁGA"),
//    ZASTAVA(ModelZASTAVA.class, "ZASTAVA"),
//    ZUK(ModelZUK.class, "ŻUK");


    private final Class<? extends Enum<? extends ModelEnumInterface>> modelEnumClass;
    private final String name;

    Brand(Class<? extends Enum<? extends ModelEnumInterface>> modelEnumClass, String name) {
        this.modelEnumClass = modelEnumClass;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Class<? extends Enum<? extends ModelEnumInterface>> getModelEnumClass() {
        return modelEnumClass;
    }

    public List<String> getModelNames() {
        return Arrays.stream(modelEnumClass.getEnumConstants())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    public static void printAllModels() {
        for (Brand brand : Brand.values()) {
            System.out.println("Marka: " + brand.getName());
            List<String> modelNames = brand.getModelNames();
            modelNames.forEach(modelName -> System.out.println("\tModel: " + modelName));
        }
    }

    public static Brand findBrandAndModel(String brandName, String modelName) {
        for (Brand brand : Brand.values()) {
            if (brand.getName().equalsIgnoreCase(brandName)) {
                List<String> modelNames = brand.getModelNames();
                if (modelNames.contains(modelName.toUpperCase())) {
                    return brand;
                }
            }
        }
        return null;
    }
}
