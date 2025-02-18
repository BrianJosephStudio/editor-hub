import { v4 as uuid } from 'uuid'

export class ClipUpload {
    public readonly file: File
    public readonly uploadPath: string
    protected _newClipName: string | null
    protected _success: boolean | null
    protected _sessionId: string | null
    protected _offset: number
    public readonly id: string

    constructor(file: File, uploadPath: string) {
        this.file = file
        this.uploadPath = uploadPath
        this._newClipName = null
        this._success = null
        this._sessionId = null
        this._offset = 0
        this.id = uuid()
    }

    public get newClipName(): string | null { return this._newClipName}
    public readonly setNewClipName = (newName: string) => {
        this._newClipName = newName
    }

    public get success(): boolean | null { return this._success }
    public readonly setSuccess = (value: boolean) => {
        if (this._success !== null) throw "can't reassign this paroperty more than once";
        this._success = value
    }

    public get sessionId(): string | null { return this._sessionId }
    public readonly setSessionId = (newValue: string) => {
        this._sessionId = newValue
    }

    public get offset(): number { return this._offset }
    public readonly setOffset = (newValue: number) => {
        this._offset = newValue
    }
}