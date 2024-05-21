import bpy
import os

homeDirectory = os.getenv("HOME")
blocksFolder = "/Users/mk/Desktop/ck-blender-minecraft-project/blender/blocks"

class BlockTemplate(name):
    def __init__:
        # get rid of any conflicting objects in scene
        self.filepath = f"{blocksFolder}/{name}.blend\\Object\\"
        self.name = name
        if bpy.data.objects[self.name]:
            bpy.data.objects[self.name].select_set(True)
            bpy.ops.object.delete()
        bpy.ops.wm.append(directory=self.filePath, filename=self.name)
        #self.object=bpy.context.active_object
        self.object=bpy.data.objects[self.name]
        self.object.hide_render = True
        self.object.hide_viewport = True
    
class Block(template, index):
    def __init__:
        bpy.ops.object.add_named(linked=False, name=template)
        self.object = bpy.context.active_object
        .name = f'{country["name"]}-pumpkin'
    print(f'when we do the radius, it will be {getRadius(country["pumpkins"])}')
    bpy.context.active_object.location[0] = xVal
    bpy.context.active_object.location[1] = 0
    bpy.context.active_object.location[2] = country["radius"]
    bpy.context.active_object.scale = [country["radius"],country["radius"],country["radius"]]
    bpy.context.object.hide_render = False
    bpy.context.object.hide_viewport = False
    xVal+=(country["radius"]+10)


        
birchLogTemplate = BlockTemplate("birch-log")

