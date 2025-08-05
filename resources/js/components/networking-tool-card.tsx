import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NetworkingToolCardProps {
    title: string;
    description: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export function NetworkingToolCard({ 
    title, 
    description, 
    icon, 
    isActive, 
    onClick, 
    children 
}: NetworkingToolCardProps) {
    return (
        <Card className={`cursor-pointer transition-all duration-200 ${
            isActive 
                ? 'ring-2 ring-blue-500 bg-gray-800/50' 
                : 'hover:bg-gray-800/30 hover:ring-1 hover:ring-gray-600'
        }`}>
            <CardHeader 
                className="pb-3 cursor-pointer" 
                onClick={onClick}
            >
                <CardTitle className="flex items-center gap-3 text-lg">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <div className="text-white">{title}</div>
                        <div className="text-sm text-gray-400 font-normal mt-1">
                            {description}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            {isActive && (
                <CardContent className="pt-0">
                    {children}
                </CardContent>
            )}
        </Card>
    );
}