import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Volume2, VolumeX, BellRing, BellOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TemperatureAlertProps {
    currentTemp: number;
}

export default function TemperatureAlert({ currentTemp }: TemperatureAlertProps) {
    const [minTemp, setMinTemp] = useState<number>(22);
    const [maxTemp, setMaxTemp] = useState<number>(30);
    const [isEnabled, setIsEnabled] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
    const [audio] = useState<HTMLAudioElement>(typeof Audio !== 'undefined' ? new Audio('/alert.mp3') : {} as HTMLAudioElement);
    const { toast } = useToast();

    // Fungsi untuk memainkan suara dengan penanganan error dan cek interaksi
    const playAlertSound = useCallback(async () => {
        if (isEnabled && !isPlaying && hasUserInteracted && audio && audio.play) {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.error('Error playing notification sound:', error);
                toast({
                    title: "Error Notifikasi Suara",
                    description: "Gagal memainkan suara notifikasi suhu. Pastikan tab browser tidak di-mute dan izinkan situs ini memutar suara.",
                    variant: "destructive",
                });
                setIsPlaying(false);
            }
        }
    }, [audio, isEnabled, isPlaying, hasUserInteracted, toast]);

    // Test suara dan aktivasi status interaksi user
    const testSound = async () => {
        if (audio && audio.play) {
            try {
                await audio.play();
                audio.pause();
                audio.currentTime = 0;
                setHasUserInteracted(true);
                toast({
                    title: "Notifikasi Diaktifkan",
                    description: "Sistem notifikasi suara telah diaktifkan. Suara test berhasil dimainkan.",
                    variant: "default",
                });
            } catch (error) {
                console.error('Error testing sound:', error);
                setHasUserInteracted(false);
                toast({
                    title: "Aktivasi Notifikasi Gagal",
                    description: "Tidak dapat memainkan suara test. Mohon berinteraksi lebih lanjut dengan halaman atau periksa pengaturan browser Anda (izinkan autoplay untuk situs ini).",
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "Browser Tidak Mendukung Audio",
                description: "Browser Anda mungkin tidak mendukung pemutaran audio atau file audio tidak ditemukan.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        if (isEnabled && hasUserInteracted) {
            if (currentTemp < minTemp || currentTemp > maxTemp) {
                playAlertSound();
            } else if (currentTemp >= minTemp && currentTemp <= maxTemp && isPlaying) {
                if (audio && audio.pause) {
                    audio.pause();
                    audio.currentTime = 0;
                    setIsPlaying(false);
                }
            }
        } else if (!hasUserInteracted && isEnabled) {
            toast({
                title: "Notifikasi Dinonaktifkan",
                description: "Notifikasi suara dinonaktifkan karena belum ada interaksi pengguna. Klik 'Test Suara' untuk mengaktifkan.",
                variant: "default",
            });
        }
    }, [currentTemp, minTemp, maxTemp, isEnabled, hasUserInteracted, playAlertSound, isPlaying, audio, toast]);

    useEffect(() => {
        if (!isEnabled && isPlaying) {
            if (audio && audio.pause) {
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [isEnabled, isPlaying, audio]);

    const handleMinTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setMinTemp(value);
        }
    };

    const handleMaxTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setMaxTemp(value);
        }
    };

    const toggleSound = () => {
        setIsEnabled(!isEnabled);
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertCircle className="text-primary" size={20} />
                    Pengaturan Notifikasi Suhu
                </h3>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={testSound}
                        className="flex items-center gap-2"
                        disabled={isPlaying}
                    >
                        {hasUserInteracted ? <BellRing size={16} /> : <BellOff size={16} />}
                        {hasUserInteracted ? 'Test Suara Aktif' : 'Test Suara'}
                    </Button>
                    <div className="flex items-center gap-2">
                        {isEnabled ? <Volume2 className="text-primary" size={20} /> : <VolumeX className="text-gray-400" size={20} />}
                        <Switch checked={isEnabled} onCheckedChange={toggleSound} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="minTemp">Suhu Minimum (°C)</Label>
                        <Input
                            id="minTemp"
                            type="number"
                            value={minTemp}
                            onChange={handleMinTempChange}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxTemp">Suhu Maksimum (°C)</Label>
                        <Input
                            id="maxTemp"
                            type="number"
                            value={maxTemp}
                            onChange={handleMaxTempChange}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        {isEnabled ? (
                            currentTemp < minTemp ? (
                                <span className="text-red-500">⚠️ Suhu terlalu rendah! ({currentTemp}°C)</span>
                            ) : currentTemp > maxTemp ? (
                                <span className="text-red-500">⚠️ Suhu terlalu tinggi! ({currentTemp}°C)</span>
                            ) : (
                                <span className="text-green-500">✓ Suhu dalam batas normal ({currentTemp}°C)</span>
                            )
                        ) : (
                            <span className="text-gray-500">Notifikasi suara dinonaktifkan</span>
                        )}
                    </p>
                </div>
            </div>
        </Card>
    );
} 