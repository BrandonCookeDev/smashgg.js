
export class Prize implements IPrize.Prize{
    
    markdown: string | null
    payoutType: string | null
    payoutTotal: string | null
    prizing: [IPrize.Prizing] | null

    constructor(markdown: string | null, payoutType: string | null,
        payoutTotal: string | null, prizing: [IPrize.Prizing] | null){
            this.markdown = markdown;
            this.payoutType = payoutType;
            this.payoutTotal = payoutTotal;
            this.prizing = prizing;
    }

    static parse(data: IPrize.Prizing) : Prize  | null{
        return null
    }
}

export namespace IPrize{
    export interface Prize{
        markdown: string | null
        payoutType: string | null
        payoutTotal: string | null
        prizing: [IPrize.Prizing] | null
    }

    export interface Prizing{
        id: number,
        placement: number,
        percent: number
    }

    export interface Data{
        prize: {
            markdown: string | null
            payoutType: string | null
            payoutTotal: string | null
        }
    }

    export interface PrieData{
        markdown: string | null
        payoutType: string | null
        payoutTotal: string | null
    }
}