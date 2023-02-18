export type Quote = {
  [key: string]: QuoteItem
};

export type QuoteItem = {
  [key: string]: number
};

export type ApilayerApiResponse = {
  "end_date": string
  quotes: Quote
  "source": string
  "start_date": string
  "success": boolean
  "timeframe": boolean
}
export const apilayerResponse: ApilayerApiResponse =
{
    "end_date": "2023-02-08",
    "quotes": {
      "2023-01-01": {
        "RUBEUR": 0.012667,
        "RUBRSD": 1.485826,
        "RUBUSD": 0.013559
      },
      "2023-01-02": {
        "RUBEUR": 0.012007,
        "RUBRSD": 1.408723,
        "RUBUSD": 0.012821
      },
      "2023-01-03": {
        "RUBEUR": 0.01298,
        "RUBRSD": 1.52272,
        "RUBUSD": 0.013689
      },
      "2023-01-04": {
        "RUBEUR": 0.013002,
        "RUBRSD": 1.52566,
        "RUBUSD": 0.013793
      },
      "2023-01-05": {
        "RUBEUR": 0.013172,
        "RUBRSD": 1.545593,
        "RUBUSD": 0.01386
      },
      "2023-01-06": {
        "RUBEUR": 0.012934,
        "RUBRSD": 1.520479,
        "RUBUSD": 0.013792
      },
      "2023-01-07": {
        "RUBEUR": 0.012934,
        "RUBRSD": 1.520479,
        "RUBUSD": 0.013792
      },
      "2023-01-08": {
        "RUBEUR": 0.012943,
        "RUBRSD": 1.520474,
        "RUBUSD": 0.013792
      },
      "2023-01-09": {
        "RUBEUR": 0.013324,
        "RUBRSD": 1.56404,
        "RUBUSD": 0.014303
      },
      "2023-01-10": {
        "RUBEUR": 0.013365,
        "RUBRSD": 1.569002,
        "RUBUSD": 0.014352
      },
      "2023-01-11": {
        "RUBEUR": 0.013434,
        "RUBRSD": 1.576843,
        "RUBUSD": 0.01446
      },
      "2023-01-12": {
        "RUBEUR": 0.013585,
        "RUBRSD": 1.594674,
        "RUBUSD": 0.014753
      },
      "2023-01-13": {
        "RUBEUR": 0.01336,
        "RUBRSD": 1.569957,
        "RUBUSD": 0.014493
      },
      "2023-01-14": {
        "RUBEUR": 0.013967,
        "RUBRSD": 1.639095,
        "RUBUSD": 0.015151
      },
      "2023-01-15": {
        "RUBEUR": 0.013998,
        "RUBRSD": 1.639111,
        "RUBUSD": 0.015152
      },
      "2023-01-16": {
        "RUBEUR": 0.013431,
        "RUBRSD": 1.576796,
        "RUBUSD": 0.014545
      },
      "2023-01-17": {
        "RUBEUR": 0.013535,
        "RUBRSD": 1.588426,
        "RUBUSD": 0.014601
      },
      "2023-01-18": {
        "RUBEUR": 0.013471,
        "RUBRSD": 1.580794,
        "RUBUSD": 0.014545
      },
      "2023-01-19": {
        "RUBEUR": 0.0133,
        "RUBRSD": 1.561655,
        "RUBUSD": 0.01441
      },
      "2023-01-20": {
        "RUBEUR": 0.013301,
        "RUBRSD": 1.564073,
        "RUBUSD": 0.014467
      },
      "2023-01-21": {
        "RUBEUR": 0.01347,
        "RUBRSD": 1.584094,
        "RUBUSD": 0.014652
      },
      "2023-01-22": {
        "RUBEUR": 0.013486,
        "RUBRSD": 1.584095,
        "RUBUSD": 0.014652
      },
      "2023-01-23": {
        "RUBEUR": 0.013334,
        "RUBRSD": 1.565311,
        "RUBUSD": 0.014497
      },
      "2023-01-24": {
        "RUBEUR": 0.013225,
        "RUBRSD": 1.552053,
        "RUBUSD": 0.014399
      },
      "2023-01-25": {
        "RUBEUR": 0.013226,
        "RUBRSD": 1.551494,
        "RUBUSD": 0.014445
      },
      "2023-01-26": {
        "RUBEUR": 0.013208,
        "RUBRSD": 1.55073,
        "RUBUSD": 0.01439
      },
      "2023-01-27": {
        "RUBEUR": 0.013004,
        "RUBRSD": 1.526634,
        "RUBUSD": 0.014139
      },
      "2023-01-28": {
        "RUBEUR": 0.013004,
        "RUBRSD": 1.526002,
        "RUBUSD": 0.014139
      },
      "2023-01-29": {
        "RUBEUR": 0.013006,
        "RUBRSD": 1.526002,
        "RUBUSD": 0.014139
      },
      "2023-01-30": {
        "RUBEUR": 0.013183,
        "RUBRSD": 1.547523,
        "RUBUSD": 0.014303
      },
      "2023-01-31": {
        "RUBEUR": 0.013044,
        "RUBRSD": 1.53064,
        "RUBUSD": 0.014167
      },
      "2023-02-01": {
        "RUBEUR": 0.012984,
        "RUBRSD": 1.524127,
        "RUBUSD": 0.014299
      },
      "2023-02-02": {
        "RUBEUR": 0.012216,
        "RUBRSD": 1.433872,
        "RUBUSD": 0.013322
      },
      "2023-02-03": {
        "RUBEUR": 0.013072,
        "RUBRSD": 1.538775,
        "RUBUSD": 0.014154
      },
      "2023-02-04": {
        "RUBEUR": 0.013072,
        "RUBRSD": 1.534173,
        "RUBUSD": 0.014154
      },
      "2023-02-05": {
        "RUBEUR": 0.013117,
        "RUBRSD": 1.534186,
        "RUBUSD": 0.014154
      },
      "2023-02-06": {
        "RUBEUR": 0.013033,
        "RUBRSD": 1.530067,
        "RUBUSD": 0.013984
      },
      "2023-02-07": {
        "RUBEUR": 0.012921,
        "RUBRSD": 1.516323,
        "RUBUSD": 0.013863
      },
      "2023-02-08": {
        "RUBEUR": 0.012738,
        "RUBRSD": 1.495027,
        "RUBUSD": 0.013651
      }
    },
    "source": "RUB",
    "start_date": "2023-01-01",
    "success": true,
    "timeframe": true
  }
