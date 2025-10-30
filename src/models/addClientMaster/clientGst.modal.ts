export interface ClientGst {
  id: string;
  clientId: string;
  gstNumber: string;
  gstType: string;
  gstAliasName: string;
  billingAddress: string;
  shippingAddress: string;
  isShippingSameAsBilling: boolean;
}
