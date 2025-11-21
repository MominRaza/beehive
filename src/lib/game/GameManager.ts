import * as THREE from 'three';
import { GridManager } from './GridManager';
import { CropManager } from './CropManager';
import { TreeManager } from './TreeManager';
import { InventoryManager } from './InventoryManager';
import { StructureManager } from './StructureManager';
import { SignManager } from './SignManager';
import { FenceManager } from './FenceManager';
import type { TileType, CropType, ToolType, InventoryItemType, TreeType } from './types';
import { Tool, type HoverState } from './tools/Tool';
import { TerraformTool } from './tools/TerraformTool';
import { PlantTool } from './tools/PlantTool';
import { ActionTool } from './tools/ActionTool';
import { CursorTool } from './tools/CursorTool';

const CHUNK_SIZE = 12;
export const CHUNK_PRICE = 100;

export class GameManager {
    private scene: THREE.Scene;
    public gridManager: GridManager;
    public cropManager: CropManager;
    public treeManager: TreeManager;
    public inventoryManager: InventoryManager;
    public structureManager: StructureManager;
    public signManager: SignManager;
    public fenceManager: FenceManager;
    public unlockedChunks: Set<string> = new Set(["0,0"]);

    private tools: Map<string, Tool> = new Map();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.gridManager = new GridManager(scene);
        this.cropManager = new CropManager(scene);
        this.treeManager = new TreeManager(scene);
        this.inventoryManager = new InventoryManager();
        this.structureManager = new StructureManager(scene);
        this.signManager = new SignManager(scene);
        this.fenceManager = new FenceManager(scene);

        this.initializeTools();

        this.updateBuyableSigns();
        this.fenceManager.updateFences(this.unlockedChunks);
    }

    private initializeTools() {
        this.tools.set("none", new CursorTool(this));

        this.tools.set("dirt", new TerraformTool(this, "dirt"));
        this.tools.set("grass", new TerraformTool(this, "grass"));
        this.tools.set("path", new TerraformTool(this, "path"));

        this.tools.set("wheat", new PlantTool(this, "wheat", false));
        this.tools.set("carrot", new PlantTool(this, "carrot", false));
        this.tools.set("tomato", new PlantTool(this, "tomato", false));

        this.tools.set("oak", new PlantTool(this, "oak", true));
        this.tools.set("pine", new PlantTool(this, "pine", true));

        this.tools.set("water", new ActionTool(this, "water"));
        this.tools.set("harvest", new ActionTool(this, "harvest"));
        this.tools.set("axe", new ActionTool(this, "axe"));
    }

    getChunkCoords(x: number, z: number): { cx: number, cz: number } {
        const cx = Math.floor((x + CHUNK_SIZE / 2) / CHUNK_SIZE);
        const cz = Math.floor((z + CHUNK_SIZE / 2) / CHUNK_SIZE);
        return { cx, cz };
    }

    isTileUnlocked(x: number, z: number): boolean {
        const { cx, cz } = this.getChunkCoords(x, z);
        return this.unlockedChunks.has(`${cx},${cz}`);
    }

    isValidChunk(cx: number, cz: number): boolean {
        // World is 60x60, Chunk is 12x12
        // Chunks range from -2 to 2
        return cx >= -2 && cx <= 2 && cz >= -2 && cz <= 2;
    }

    unlockChunk(cx: number, cz: number): boolean {
        if (!this.isValidChunk(cx, cz)) return false;

        const key = `${cx},${cz}`;
        if (this.unlockedChunks.has(key)) return false;

        if (this.inventoryManager.removeItem("coins", CHUNK_PRICE)) {
            this.unlockedChunks.add(key);
            this.updateBuyableSigns();
            this.fenceManager.updateFences(this.unlockedChunks);
            return true;
        }
        return false;
    }

    private updateBuyableSigns() {
        const buyableChunks: { cx: number, cz: number }[] = [];
        const checked = new Set<string>();

        this.unlockedChunks.forEach(key => {
            const [cx, cz] = key.split(',').map(Number);
            const neighbors = [
                { cx: cx + 1, cz },
                { cx: cx - 1, cz },
                { cx: cx, cz: cz + 1 },
                { cx: cx, cz: cz - 1 }
            ];

            neighbors.forEach(n => {
                if (!this.isValidChunk(n.cx, n.cz)) return;

                const nKey = `${n.cx},${n.cz}`;
                if (!this.unlockedChunks.has(nKey) && !checked.has(nKey)) {
                    buyableChunks.push(n);
                    checked.add(nKey);
                }
            });
        });

        this.signManager.updateSigns(buyableChunks);
    }

    handleInput(tool: ToolType, x: number, z: number, intersectedObject?: THREE.Object3D): { success: boolean, message?: string, data?: any } {
        const toolInstance = this.tools.get(tool);
        if (toolInstance) {
            return toolInstance.use(x, z, intersectedObject);
        }
        return { success: false };
    }

    getHoverState(tool: ToolType, x: number, z: number, intersectedObject?: THREE.Object3D): HoverState {
        const toolInstance = this.tools.get(tool);
        if (toolInstance) {
            return toolInstance.getHoverState(x, z, intersectedObject);
        }
        return { visible: false };
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
        const cropsData = Array.from(this.cropManager.crops.entries()).map(([key, crop]) => ({
            key,
            type: crop.type,
            growthStage: crop.growthStage
        }));
        const treesData = Array.from(this.treeManager.trees.entries()).map(([key, tree]) => ({
            key,
            type: tree.type,
            growthStage: tree.growthStage
        }));
        const inventoryData = this.inventoryManager.serialize();
        const unlockedChunks = Array.from(this.unlockedChunks);
        return { tiles: tilesData, crops: cropsData, trees: treesData, inventory: inventoryData, unlockedChunks };
    }

    load(data: { tiles: any[], crops: any[], trees?: any[], inventory?: any, unlockedChunks?: string[] }) {
        this.clear(); // Clear current state

        // Re-create hut
        this.structureManager = new StructureManager(this.scene);

        if (data.inventory) {
            this.inventoryManager.load(data.inventory);
        }

        if (data.unlockedChunks) {
            this.unlockedChunks = new Set(data.unlockedChunks);
        } else {
            this.unlockedChunks = new Set(["0,0"]);
        }
        this.updateBuyableSigns();
        this.fenceManager.updateFences(this.unlockedChunks);

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
                this.treeManager.createTree(x, z, treeData.type || "oak");

                const tree = this.treeManager.trees.get(treeData.key);
                if (tree && treeData.growthStage > 0) {
                    tree.growthStage = treeData.growthStage;
                    this.treeManager.updateVisuals(tree);
                }
            });
        }
    }

    clear() {
        this.gridManager.clear();
        this.cropManager.dispose(); // Crops are individual meshes, so dispose is fine
        this.treeManager.dispose(); // Trees are individual meshes, so dispose is fine
        this.structureManager.dispose();
        this.signManager.clear();
        this.fenceManager.clear();
    }

    dispose() {
        this.gridManager.dispose();
        this.cropManager.dispose();
        this.treeManager.dispose();
        this.structureManager.dispose();
        this.signManager.dispose();
        this.fenceManager.dispose();
    }
}

