declare global {
  interface PosActionResult<DataType extends object> {
    Succeed: boolean;
    ErrorCode: number;
    Message: string;
    Data: DataType;
  }

  type ProductSearchResultDto = {
    ProductBarcodeId: string;
    ProductId: string;
    Barcode: string;
    ShortName: string;
    LongName: string;
    Price: number;
  };

  type Product = {
    id: string;
    barcode: string;
    name: string;
    description: string;
  };

  interface SQLError {
    code: number;
    message: string;
  }

  type User = {
    userName: string;
    password: string;
    customerId: number;
    database: string;
  };
}

export {};
