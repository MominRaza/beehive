import * as THREE from 'three';
import { GridManager } from './GridManager';
import { CropManager } from './CropManager';
import { TreeManager } from './TreeManager';
import { InventoryManager } from './InventoryManager';
import { StructureManager } from './StructureManager';
import type { TileType, CropType, ToolType, InventoryItemType } from './types';

export class GameManager {
    private scene: THREE.Scene;
    public gridManager: GridManager;
    public cropManager: CropManager;
    public treeManager: TreeManager;
    public inventoryManager: InventoryManager;
    public structureManager: StructureManager;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.gridManager = new GridManager(scene);
        this.cropManager = new CropManager(scene);
        this.treeManager = new TreeManager(scene);
        this.inventoryManager = new InventoryManager();
        this.structureManager = new StructureManager(scene);
    }

    handleInput(tool: ToolType, x: number, z: number): { success: boolean, message?: string } {
        if (tool === "none") return { success: false };

        // Prevent interaction near the hut (0,0)
        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { success: false };

        if (tool === "wheat" || tool === "carrot" || tool === "tomato") {
            const tileType = this.gridManager.getTileType(x, z);
            if (tileType === "dirt") {
                const seedType = `${tool}_seed` as InventoryItemType;
                if (this.inventoryManager.removeItem(seedType, 1)) {
                    this.cropManager.createCrop(x, z, tool);
                    return { success: true };
                } else {
                    return { success: false, message: "Not enough seeds!" };
                }
            }
        } else if (tool === "water") {
            const tileType = this.gridManager.getTileType(x, z);
            if (tileType === "dirt") {
                this.gridManager.waterTile(x, z);
                return { success: true };
            }
        } else if (tool === "harvest") {
            // Check if inventory is full before harvesting
            if (this.inventoryManager.getProduceCount() >= this.inventoryManager.getMaxCapacity()) {
                return { success: false, message: "Inventory Full!" };
            }

            // Try harvesting crop
            const harvestedCrop = this.cropManager.harvest(x, z);
            if (harvestedCrop) {
                const produceType = `${harvestedCrop}_produce` as InventoryItemType;
                if (this.inventoryManager.addItem(produceType, 1)) {
                    // No longer giving seeds back automatically
                    return { success: true };
                } else {
                    // Should not happen if we checked capacity, but just in case
                    return { success: false, message: "Inventory Full! (Unexpected)" };
                }
            }
        } else if (tool === "axe") {
            // Check if inventory is full before harvesting
            // Wood adds 2 items, so check if we have space for 2
            if (this.inventoryManager.getProduceCount() + 2 > this.inventoryManager.getMaxCapacity()) {
                return { success: false, message: "Inventory Full!" };
            }

            // Try harvesting tree
            if (this.treeManager.harvest(x, z)) {
                if (this.inventoryManager.addItem("wood", 2)) {
                    return { success: true };
                } else {
                    return { success: false, message: "Inventory Full! (Unexpected)" };
                }
            }
        } else if (tool === "tree") {
            const tileType = this.gridManager.getTileType(x, z);
            if (tileType === "grass") {
                if (this.inventoryManager.removeItem("tree_sapling", 1)) {
                    this.treeManager.createTree(x, z);
                    return { success: true };
                } else {
                    return { success: false, message: "Not enough saplings!" };
                }
            }
        } else if (tool === "dirt" || tool === "grass" || tool === "path") {
            // Check if tile is occupied
            const key = `${x},${z}`;
            if (this.cropManager.crops.has(key) || this.treeManager.trees.has(key)) {
                return { success: false, message: "Tile is occupied!" };
            }

            this.gridManager.createTile(x, z, tool);
            return { success: true };
        }
        return { success: false };
    }

    getHoverState(tool: ToolType, x: number, z: number): { visible: boolean, color?: number, scaleY?: number, posY?: number } {
        if (tool === "none") return { visible: false };

        // Prevent hover near hut
        if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) return { visible: false };

        const tileType = this.gridManager.getTileType(x, z);

        if (tool === "tree") {
            if (tileType === "grass") {
                return { visible: true, color: 0x228b22, scaleY: 0.5, posY: 0.35 }; // Forest Green
            }
            return { visible: false };
        }

        if (tool === "axe") {
            // Check if there is a tree?
            // For now just show red indicator on grass/anywhere?
            // Ideally we check if tree exists.
            // But GridManager doesn't know about trees. TreeManager does.
            // I can't easily check here without exposing TreeManager state more.
            // Let's just show a red indicator.
            return { visible: true, color: 0xff0000, scaleY: 1.1, posY: 0.05 };
        }

        if (tool === "wheat" || tool === "carrot" || tool === "tomato" || tool === "water" || tool === "harvest") {
            if (tileType === "dirt") {
                if (tool === "water") {
                    return { visible: true, color: 0x0000ff, scaleY: 1.1, posY: 0.05 }; // Blue
                } else if (tool === "harvest") {
                    return { visible: true, color: 0x800080, scaleY: 1.1, posY: 0.05 }; // Purple
                } else {
                    let color = 0xffff00; // Wheat
                    if (tool === "carrot") color = 0xffa500;
                    if (tool === "tomato") color = 0xff6347;
                    return { visible: true, color, scaleY: 0.5, posY: 0.35 };
                }
            }
            return { visible: false };
        }

        // Tile placement tools
        let color = 0xffffff;
        let scaleY = 1;
        let posY = 0.05;

        if (tool === "dirt") {
            color = 0x8b4513;
            scaleY = 1;
            posY = 0.05;
        } else if (tool === "grass") {
            color = 0x228b22;
            scaleY = 3;
            posY = 0.15;
        } else if (tool === "path") {
            color = 0x808080;
            scaleY = 4;
            posY = 0.2;
        }

        return { visible: true, color, scaleY, posY };
    }

    update(deltaTime: number) {
        this.cropManager.update(deltaTime);
        this.treeManager.update(deltaTime);
    }

    serialize() {
        const tilesData = Array.from(this.gridManager.tiles.entries()).map(([key, data]) => ({
            key,
            type: data.type,
            isWatered: data.isWatered
        }));
        const cropsData = Array.from(this.cropManager.crops.entries()).map(([key, data]) => ({
            key,
            type: data.type,
            growthStage: data.growthStage
        }));
        const treesData = Array.from(this.treeManager.trees.entries()).map(([key, data]) => ({
            key,
            growthStage: data.growthStage
        }));
        const inventoryData = this.inventoryManager.serialize();
        return { tiles: tilesData, crops: cropsData, trees: treesData, inventory: inventoryData };
    }

    load(data: { tiles: any[], crops: any[], trees?: any[], inventory?: any }) {
        this.dispose(); // Clear current state

        // Re-create hut
        this.structureManager = new StructureManager(this.scene);

        if (data.inventory) {
            this.inventoryManager.load(data.inventory);
        }

        data.tiles.forEach(tileData => {
            const [x, z] = tileData.key.split(',').map(Number);
            this.gridManager.createTile(x, z, tileData.type);
            if (tileData.isWatered) {
                this.gridManager.waterTile(x, z);
            }
        });

        data.crops.forEach(cropData => {
            const [x, z] = cropData.key.split(',').map(Number);
            this.cropManager.createCrop(x, z, cropData.type);

            // Fast forward growth if saved
            const crop = this.cropManager.crops.get(cropData.key);
            if (crop && cropData.growthStage > 0) {
                crop.growthStage = cropData.growthStage;
                this.cropManager.updateVisuals(crop);
            }
        });

        if (data.trees) {
            data.trees.forEach(treeData => {
                const [x, z] = treeData.key.split(',').map(Number);
                this.treeManager.createTree(x, z);

                const tree = this.treeManager.trees.get(treeData.key);
                if (tree && treeData.growthStage > 0) {
                    tree.growthStage = treeData.growthStage;
                    this.treeManager.updateVisuals(tree);
                }
            });
        }
    }

    dispose() {
        this.gridManager.dispose();
        this.cropManager.dispose();
        this.treeManager.dispose();
        this.structureManager.dispose();
    }
}

