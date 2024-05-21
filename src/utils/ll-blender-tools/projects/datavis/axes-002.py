import bpy

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def make_ground_plane_collider():
    bpy.ops.mesh.primitive_plane_add(size=50, location=(0,0,0))
    bpy.ops.rigidbody.object_add()
    bpy.context.object.rigid_body.type = 'PASSIVE'

def use_cycles():
    bpy.context.scene.render.engine = 'CYCLES'
#    bpy.context.window.workspace = bpy.data.workspaces["Layout"]
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                print(space.type)
                if space.type == 'VIEW_3D':
                    space.shading.type = 'RENDERED'
                    
class Material:
    def __init__(self, name):
        self.name = name
        #
        # mat = bpy.data.materials.get("Material.001")
        #mat_one.diffuse_color = (0.4,0.7,0.9)
        self.mat = bpy.data.materials.new(name=name)
        self.mat.use_nodes = True
        
#        self.mat_nodes = self.mat.node_tree.nodes
#        self.mat_links = self.mat.node_tree.links
#        self.output = self.mat_nodes['Material Output']
#        self.diffuse = self.mat_nodes['Diffuse BSDF']

    def set_color(self, red, green, blue, alpha):
#        self.mat.diffuse_color = (red, green, blue, alpha)
        self.mat.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (red, green, blue, alpha)


    def apply_to(self, object):
        if object.data.materials:
            object.data.materials[0] = self.mat
        else:
            object.data.materials.append(self.mat)

class Cube:
    def __init__(self):
        bpy.ops.mesh.primitive_cube_add()
        self.obj = bpy.context.active_object

class Light:
    def __init__(self):
        bpy.ops.object.light_add(type='AREA', radius=1, align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))
        self.object = bpy.context.active_object
        self.object.data.size = 10
        self.object.location[2] = 10
        self.object.data.energy = 1000
    

def make_ground_plane_collider():
    bpy.ops.mesh.primitive_plane_add(size=50, location=(0,0,0))
    bpy.ops.rigidbody.object_add()
    bpy.context.object.rigid_body.type = 'PASSIVE'    
    
def main():
    clear_scene()
    use_cycles()
    make_ground_plane_collider()
    cube1 = Cube()
    cube2 = Cube()
    cube1.obj.location[0] =2
    cube2.obj.location[0] = -2
    mat1 = Material("red-box-material")
    mat1.set_color(0.98,0.1,0.2, 1)
    mat1.apply_to(cube1.obj)
    mat2 = Material("blue-box-material")
    mat2.set_color(0.08,0.1,0.9, 1)
    mat2.apply_to(cube2.obj)
    light = Light()
    
if __name__ == "__main__":
    main()


