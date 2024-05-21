import bpy
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

grassPathTop="/Users/mk/Desktop/ck-blender-minecraft-project/textures/Minecraft-textures/assets/minecraft/textures/block/grass_path_top.png"
grassPathSide="/Users/mk/Desktop/ck-blender-minecraft-project/textures/Minecraft-textures/assets/minecraft/textures/block/grass_block_side.png"


class Block:
    def __init__(self, name, side, top, bottom):
        bpy.ops.mesh.primitive_cube_add()
        self.object = bpy.context.active_object
        self.name = name
        self.side = side
        if top:
            self.top = top
        else: 
            self.top = self.side
        if bottom:
            self.bottom = bottom
        else: 
            self.bottom = self.side
        self.sideImage = bpy.data.images.load(self.side)
        self.sideTex = bpy.data.textures.new(self.side, 'IMAGE')
        self.sideTex.image = self.sideImage
        self.sideMaterial = bpy.data.materials.new(name=f"{name}-side-material")
        self.topMaterial = bpy.data.materials.new(name=f"{name}-top-material")
        self.bottomMaterial = bpy.data.materials.new(name=f"{name}-bottom-material")
        self.sideMaterial.use_nodes = True
        self.topMaterial.use_nodes = True
        self.bottomMaterial.use_nodes = True
        bsdf = self.sideMaterial.node_tree.nodes["Principled BSDF"]
        texImage = self.sideMaterial.node_tree.nodes.new('ShaderNodeTexImage')
        texImage.image = bpy.data.images.load(self.side)
        self.sideMaterial.node_tree.links.new(bsdf.inputs['Base Color'], texImage.outputs['Color'])
        self.sideMaterial.node_tree.nodes["Image Texture"].interpolation = 'Closest'

        
        if self.object.data.materials:
            self.object.data.materials[0] = self.sideMaterial
        else: 
            self.object.data.materials.append(self.sideMaterial)
        self.object.data.materials.append(self.topMaterial)
        self.object.data.materials.append(self.bottomMaterial)
        
        
        
#            
#            
#def set_UV_editor_texture(mesh):
#    """ set the image for the face.tex layer on all the faces
#    so we have a rough idea of what the mesh will look like
#    in the 3D view's Texture render mode"""
#    # load the mesh data into a bmesh object
#    bm = bmesh.new()
#    bm.from_mesh(mesh)
#    bm.faces.ensure_lookup_table()
#    # Get the "tex" layer for the first UV map
#    # If you don't already have a UV map, why are you even calling this function?
#    tex_layer = bm.faces.layers.tex[mesh.uv_layers[0].name]
#    for i in range(len(bm.faces)):
#        # figure out which material this face uses
#        mi = bm.faces[i].material_index
#        mat = mesh.materials[mi]
#        # Assume that we want to use the image from the first texture slot;
#        # and assume that the material has a texture in that first slot;
#        # and assume that the texture is an image texture instead of a procedural texture.
#        # if any of several assumptions are wrong, this will explode
#        img = mat.texture_slots[0].texture.image
#        bm.faces[i][tex_layer].image = img
#    # copy the modified data into the mesh
#    bm.to_mesh(mesh)
#fname = "/var/tmp/blender/mohawk-seal0001.png"
#obj = bpy.context.active_object
#mat = material_for_texture(fname)
#if len(obj.data.materials)<1:
#    obj.data.materials.append(mat)
#else:
#    obj.data.materials[0] = mat
#set_UV_editor_texture(obj.data)


blockOne = Block("grass", grassPathSide, grassPathTop, None)
#blockTwo = Block("iron", "C:/Users/ll/Desktop/_blender/block/iron_block.png", None, None)
blockOne.object.location[2] = 3