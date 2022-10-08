export interface FileMakerXML {
  FMPXMLRESULT: {
    $: { xmlns: string };
    DATABASE: [
      {
        $: {
          DATEFORMAT: string;
          LAYOUT: string;
          NAME: string;
          RECORDS: string;
          TIMEFORMAT: string;
        };
      }
    ];
    ERRORCODE: string[];
    METADATA: [
      {
        FIELD: [
          {
            $: {
              EMPTYOK: string;
              MAXREPEAT: string;
              NAME: string;
              TYPE: string;
            };
          }
        ];
      }
    ];
    PRODUCT: [{ $: { BUILD: string; NAME: string; VERSION: string } }];
    RESULTSET: [
      {
        $: { FOUND: string };
        ROW: [
          { $: { MODID: string; RECORDID: string }; COL: [{ DATA: [any] }] }
        ];
      }
    ];
  };
}
