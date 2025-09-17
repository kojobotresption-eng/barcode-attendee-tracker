import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScan: (result: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

export default function QRScanner({ onScan, isActive, onToggle }: QRScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isActive && !readerRef.current) {
      readerRef.current = new BrowserMultiFormatReader();
    }
    
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, [isActive]);

  const scanFromWebcam = async () => {
    if (!webcamRef.current || !readerRef.current || isScanning) return;
    
    setIsScanning(true);
    const canvas = webcamRef.current.getCanvas();
    
    if (canvas) {
      try {
        // Convert canvas to data URL and create image element
        const dataUrl = canvas.toDataURL('image/jpeg');
        const img = new Image();
        img.onload = async () => {
          try {
            const result = await readerRef.current!.decodeFromImage(img);
            if (result) {
              onScan(result.getText());
              toast({
                title: "QR Code Scanned!",
                description: `Student ID: ${result.getText()}`,
              });
            }
          } catch (error) {
            // No QR code found, continue scanning
          }
          setIsScanning(false);
        };
        img.src = dataUrl;
      } catch (error) {
        setIsScanning(false);
      }
    } else {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(scanFromWebcam, 1000);
    return () => clearInterval(interval);
  }, [isActive, isScanning]);

  return (
    <Card className="bg-gradient-card shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scan className="w-6 h-6 text-primary" />
          QR/Barcode Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {isActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                facingMode: 'environment'
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <CameraOff className="w-12 h-12 mx-auto mb-2" />
                <p>Camera is off</p>
              </div>
            </div>
          )}
          
          {isActive && (
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onToggle}
            variant={isActive ? "destructive" : "scanner"}
            className="flex-1"
          >
            {isActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                Stop Scanner
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                Start Scanner
              </>
            )}
          </Button>
          
          {isActive && (
            <Button
              onClick={scanFromWebcam}
              disabled={isScanning}
              variant="gradient"
            >
              <Scan className="w-4 h-4" />
              {isScanning ? 'Scanning...' : 'Scan Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}