import React from 'react';
import { 
    Squares2X2Icon, HeartIcon, ShoppingBagIcon, AcademicCapIcon, 
    DevicePhoneMobileIcon, BoltIcon, SparklesIcon, CarIcon, PaintBrushIcon, 
    CakeIcon, WrenchScrewdriverIcon, GiftIcon, BuildingLibraryIcon, 
    InformationCircleIcon, DocumentDuplicateIcon, TruckIcon, HomeModernIcon, 
    UserGroupIcon, BeakerIcon, FireIcon, BookOpenIcon, TrashIcon, 
    BanknotesIcon, EnvelopeIcon, FilmIcon
} from './Icons';

export const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    BuildingLibraryIcon, InformationCircleIcon, DocumentDuplicateIcon, TruckIcon,
    HeartIcon, BuildingStorefrontIcon: ShoppingBagIcon, HomeModernIcon, UserGroupIcon, BeakerIcon, CakeIcon, FireIcon, ShoppingBagIcon,
    AcademicCapIcon, BookOpenIcon, GiftIcon, FilmIcon, SparklesIcon, BoltIcon, TrashIcon, WrenchScrewdriverIcon,
    BanknotesIcon, EnvelopeIcon,
    DevicePhoneMobileIcon, CarIcon, Squares2X2Icon, PaintBrushIcon
};

export const getIcon = (name: string | undefined, props: React.SVGProps<SVGSVGElement>) => {
    if (!name) return <Squares2X2Icon {...props} />;
    const IconComponent = iconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : <Squares2X2Icon {...props} />;
};
