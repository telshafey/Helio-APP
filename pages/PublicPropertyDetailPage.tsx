import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, HomeModernIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';
import ShareButton from '../components/common/ShareButton';

// Reusable ImageSlider component
const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    const goToNext = () => setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));

    if (images.length === 0) {
        return <div className="w-full h-64 sm:h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-lg"><HomeModernIcon className="w-20 h-20 text-slate-400"/></div>
    }

    return (
        <div className="relative w-full h-64 sm:h-96 group">
            <div style={{ backgroundImage: `url(${images[currentIndex]})` }} className="w-full h-full rounded-lg bg-center bg-cover duration-500"></div>
            {images.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon className="w-6 h-6"/></button>
                </>
            )}
        </div>
    );
}

const PublicPropertyDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { propertyId } = useParams<{ propertyId: string }>();
    const { properties } = useData();

    const property = useMemo(() => properties.find(p => p.id === Number(propertyId)), [properties, propertyId]);

    if (!property) {
        return <div className="flex items-center justify-center h-screen"><Spinner /> <p className="ml-4">جاري تحميل العقار...</p></div>;
    }

    const priceLabel = property.type === 'rent' ? 'جنيه/شهرياً' : 'جنيه';

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner
                title={property.title}
                subtitle={property.location.address}
                icon={<HomeModernIcon className="w-12 h-12 text-amber-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <ImageSlider images={property.images} />
                        <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <h2 className="text-2xl font-bold border-b pb-2 mb-4">الوصف</h2>
                                <p>{property.description}</p>
                            </div>
                            
                            {property.amenities.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-bold mb-4">وسائل الراحة</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                    <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${property.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                                        {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                                    </span>
                                    <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-4">{property.price.toLocaleString('ar-EG')}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{priceLabel}</p>
                                </div>
                                <h3 className="text-xl font-bold mb-4">معلومات الاتصال</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <MapPinIcon className="w-5 h-5 text-gray-400"/>
                                        <span className="font-semibold">{property.contact.name}</span>
                                    </div>
                                    <a href={`tel:${property.contact.phone}`} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
                                        <PhoneIcon className="w-6 h-6" />
                                        <span>اتصال: {property.contact.phone}</span>
                                    </a>
                                     <ShareButton
                                        title={property.title}
                                        text={`تحقق من هذا العقار في تطبيق Helio: ${property.title}`}
                                     />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPropertyDetailPage;
