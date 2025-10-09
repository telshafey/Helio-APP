import React from 'react';

interface PropertyFiltersProps {
    priceRange: { min: string; max: string };
    setPriceRange: (range: { min: string; max: string }) => void;
    selectedAmenities: string[];
    setSelectedAmenities: (amenities: string[]) => void;
}

const availableAmenities = [
    "أمن 24 ساعة", "جراج خاص", "حديقة", "مصعد", 
    "حمام سباحة", "حديقة خاصة", "مفروشة بالكامل", "مطبخ مجهز", 
    "روف خاص", "فيو مفتوح"
];

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
    priceRange,
    setPriceRange,
    selectedAmenities,
    setSelectedAmenities,
}) => {

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(
            selectedAmenities.includes(amenity)
                ? selectedAmenities.filter(a => a !== amenity)
                : [...selectedAmenities, amenity]
        );
    };

    return (
        <div className="space-y-8">
            {/* Price Range */}
            <div>
                <h3 className="text-lg font-semibold mb-4">نطاق السعر (جنيه مصري)</h3>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        placeholder="أقل سعر"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 text-center"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="أعلى سعر"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 text-center"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h3 className="text-lg font-semibold mb-4">وسائل الراحة</h3>
                <div className="grid grid-cols-2 gap-3">
                    {availableAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedAmenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                className="form-checkbox h-5 w-5 rounded text-cyan-500"
                            />
                            <span className="text-sm">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertyFilters;
