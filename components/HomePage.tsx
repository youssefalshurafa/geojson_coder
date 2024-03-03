'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

export default function HomePage() {
    const [geoJSON, setGeoJSON] = useState<string | null>(null);
    const [modifiedGeoJSON, setModifiedGeoJSON] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [codeInitial, setCodeInitial] = useState<string | null>(null);
    const { toast } = useToast();
    // Function to handle file selection
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const content = event.target?.result as string;
                setGeoJSON(content);
            };
            reader.readAsText(file);
        }
    };
    const addAdmin1PCode = () => {
        if (!geoJSON) return; // Check if geoJSON is null
        if (!codeInitial) return; // Check if geoJSON is null
        setIsLoading(true);
        const geoJSONObject = JSON.parse(geoJSON); // Parse the GeoJSON string
        let counter = 1;
        geoJSONObject.features.forEach((feature: any) => {
            const admin1PCode = `${codeInitial}${String(counter).padStart(
                3,
                '0'
            )}`;
            feature.properties.ADMIN1_PCODE = admin1PCode;
            counter++;
        });
        const modifiedGeoJSONString = JSON.stringify(geoJSONObject); // Convert the modified GeoJSON object back to string
        setModifiedGeoJSON(modifiedGeoJSONString);
        setIsLoading(false);
    };
    const handleDownload = () => {
        if (modifiedGeoJSON) {
            const blob = new Blob([modifiedGeoJSON], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'modified_geojson.json';
            link.click();
            URL.revokeObjectURL(url);
        } else {
            console.error('No modified GeoJSON available.');
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(codeInitial);

        if (!geoJSON || !codeInitial) return;
        await addAdmin1PCode();
        toast({
            description: 'Your geojson has been modified.',
        });
    };
    console.log(isLoading);

    return (
        <main className="p-12 flex flex-col justify-center items-center gap-8  h-screen text-slate-950">
            <h1 className="text-center text-4xl font-semibold font-in ">
                Geojson Editor
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col  gap-8 items-center glass p-4 rounded-md "
            >
                <div className="flex w-full  justify-between items-center gap-2 ">
                    <Label>Insert your geojson</Label>
                    <Input
                        onChange={handleFileChange}
                        className=" w-[10rem] mt-2"
                        type="file"
                        required
                    />
                </div>
                <div className="flex w-full  justify-between items-center gap-2   ">
                    <Label>Code initials</Label>
                    <Input
                        onChange={(e) => setCodeInitial(e.target.value)}
                        className=" w-[10rem] mt-2 text-black"
                        placeholder="example: UG"
                        type="text"
                        required
                    />
                </div>

                <Button type="submit">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        ''
                    )}
                    Modifiy
                </Button>
            </form>
            <Button
                disabled={!geoJSON || !codeInitial ? true : false}
                className="w-max"
                onClick={handleDownload}
            >
                Download
            </Button>
        </main>
    );
}
