import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';

interface QRCodeGeneratorProps {
    text: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text }) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const width = 400
    const handleDownload = async () => {
        if (qrCodeRef.current) {
            const canvas = await html2canvas(qrCodeRef.current);
            const qrCodeDataURL = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = qrCodeDataURL;
            link.download = 'qrcode.jpg';
            link.click();
        }
    };

    return (
        <div>

            <div ref={qrCodeRef}>

                <QRCode value={text} size={width} />
            </div>
            <button onClick={handleDownload}>Download QR Code</button>
        </div>
    );
};

export default QRCodeGenerator;
