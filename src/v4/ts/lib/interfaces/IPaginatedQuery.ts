
export interface IPaginatedQueryOptions {
	page?: number | null,
	perPage?: number | null,
	pageInfo?: IPaginatedQueryPageInfoData | string,
	[x: string]: any
}

export interface IPaginatedQueryPageInfoData {
	pageInfo: {
		totalPages: number
	}
}

export interface IPaginatedQueryFilters {
	[x: string]: {
		[x: string]: string
	}
}
