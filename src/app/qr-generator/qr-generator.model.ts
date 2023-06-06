import { QRCodeComponent } from 'angularx-qrcode';
import { QRCodeErrorCorrectionLevel } from "qrcode";


export class qrCode_model {
    qruuid?: string;
    qid?: string;
    qrTitle?: string;
    qrData?: string;
    width?: number;
    errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
    userId?: string;
    
    constructor(qruuid: string, qid: string, qrTitle: string, qrData: string, width: number, errorCorrectionLevel: QRCodeErrorCorrectionLevel, userId: string) {
        this.qruuid = qruuid;
        this.qid = qid;
        this.qrTitle = qrTitle;
        this.qrData = qrData;
        this.width = width;
        this.errorCorrectionLevel = errorCorrectionLevel;
        this.userId = userId;
    }
}