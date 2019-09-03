import { IValidator } from './ParamValidators'

/**
 *
 */
export class Optional {

	/**
	 *
	 */
	static valueOf(): boolean {
		return false
	}
}

/**
 *
 */
export class Required {

	/**
	 *
	 */
	static valueOf(): boolean {
		return true
	}
}

/**
 *
 */
export interface IParamSignature {
	required: (Required | Optional)
	name: string
	key: string | null
	validation: IValidator
	resolved: boolean
	payload: Object | null
	raw: Object | null
}

/**
 *
 */
export type Param = { [k: string]: (string | number | boolean | Object | undefined) }
export type Payload = { key: string, value: (string | number | boolean | Object), raw: (string | number | boolean | Object | null) }
export type PayloadVO = { [k: string]: Payload }

/**
 *
 */
export type ParamData = (string | boolean | number | { raw: string | boolean | number, payload: string | boolean | number })

/**
 *
 */
export type TemplateData = Object | String

/**
 *
 */
export class ParamSignature implements IParamSignature {
	public validation: IValidator
	public payload: string | number | boolean | null = null
	public raw: string | number | boolean | null = null
	public resolved: boolean = false

	/**
	 *
	 */
	constructor(public required: (Required | Optional),
		public name: string,
		public key: string | null,
		validation: IValidator) {

		this.validation = validation
	}

}
