
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
}