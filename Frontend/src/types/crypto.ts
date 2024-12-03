export interface Coin {
  
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

export interface Chain {
id:string;
  name: string;
  icon: string;
  coins: Coin[];
} 