import bpy

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def make_ground_plane_collider():
    bpy.ops.mesh.primitive_plane_add(size=50, location=(0,0,0))
    bpy.ops.rigidbody.object_add()
    bpy.context.object.rigid_body.type = 'PASSIVE'

class Material:
    def __init__(self, name):
        self.name = name
        #textObject.material_slot_assign("Material.001")
        # mat = bpy.data.materials.get("Material.001")
        #mat_one.diffuse_color = (0.4,0.7,0.9)
        self.mat = bpy.data.materials.new(name=name)
        self.mat.use_nodes = True
        self.mat_nodes = self.mat.node_tree.nodes
        self.mat_links = self.mat.node_tree.links
        # a new material node tree already has a diffuse and material output node
        self.output = self.mat_nodes['Material Output']
        self.diffuse = self.mat_nodes['Diffuse BSDF']

    def set_color(red, green, blue):
        self.mat.diffuse_color =(red, green, blue)

class Cube:
    def __init__(self):
        bpy.ops.mesh.primitive_cube_add()
        self.obj = bpy.context.active_object

def main():
    clear_scene()
    cube1 = Cube()
    cube2 = Cube()
    cube1.obj.location[0] =2
    cube2.obj.location[0] = -2
    
    
if __name__ == "__main__":
    main()


