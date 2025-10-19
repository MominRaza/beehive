import { CROP_DEFINITIONS } from '../stores/farmDefinitions';

/**
 * Get icon for a crop type
 */
export function getCropIcon(cropId: string): string {
    const icons: Record<string, string> = {
        wheat: '🌾',
        carrot: '🥕',
        potato: '🥔',
        tomato: '🍅',
        corn: '🌽',
        pumpkin: '🎃',
    };
    return icons[cropId] || '🌱';
}

/**
 * Get tool icon
 */
export function getToolIcon(toolId: string): string {
    switch (toolId) {
        case 'hoe':
            return '🔨';
        case 'watering_can':
            return '💧';
        case 'scythe':
            return '🔪';
        case 'axe':
            return '🪓';
        default:
            return '🔧';
    }
}

/**
 * Format seeds from inventory for display
 */
export function formatInventorySeeds(inventorySeeds: Record<string, number>) {
    return Object.entries(inventorySeeds)
        .filter(([_, count]) => count > 0)
        .map(([seedId, count]) => {
            const def = CROP_DEFINITIONS.find((c) => c.id === seedId);
            return {
                id: seedId,
                name: def?.name || seedId,
                count,
                icon: getCropIcon(seedId),
            };
        });
}
