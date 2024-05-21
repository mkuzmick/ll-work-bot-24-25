import bpy

def parse_arguments(argv):
    usage_text = (
            "Run blender in background mode with this script:"
            "  blender --background --python " + __file__ + " -- [options]"
        )
    if "--" not in argv:
        argv = []  # as if no args are passed
    else:
        argv = argv[argv.index("--") + 1:]  # get all args after "--"
    parser = argparse.ArgumentParser(description=usage_text)
    parser.add_argument(
        "-n", "--NAME_TO_DROP", dest="NAME_TO_DROP", type=str, required=False,
        help="This name will be the one we use for the name drop",
    )
    parser.add_argument(
        "-o", "--OUTPUT_PATH", dest="OUTPUT_PATH", type=str, required=True,
        help="This text will be used to define the output path for the blender file",
    )
    parser.add_argument(
        "--RENDER_PATH", dest="RENDER_PATH", type=str, required=True,
        help="This text will be used to define the render path",
    )
    args = parser.parse_args(argv)
    return args

def make_ground_plane_collider():
    bpy.ops.mesh.primitive_plane_add(size=50, location=(0,0,0))
    bpy.ops.rigidbody.object_add()
    bpy.context.object.rigid_body.type = 'PASSIVE'

def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def trim_scene_length(frames):
    bpy.context.scene.frame_end = frames

def use_cycles():
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.window.workspace = bpy.data.workspaces["Layout"]
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                print(space.type)
                if space.type == 'VIEW_3D':
                    space.shading.type = 'RENDERED'

def remove_doubles():
    bpy.ops.object.editmode_toggle()
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles()

def origin_to_center_of_gravity():
    # object must be active
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')

def repositionOrigin(rotation, position):
    pass

def bake():
    bpy.ops.ptcache.bake_all(bake=True)

def render_scene(render_path):
    bpy.context.scene.render.filepath=f'{render_path}/test.mov'
    bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
    bpy.context.scene.render.ffmpeg.format = 'QUICKTIME'
    data_context = {"blend_data": bpy.context.blend_data, "scene": bpy.context.scene}
    bpy.ops.render.render(data_context)

def render_360p_video(scene, camera_object, filepath):
    scene.camera = camera_object
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.filepath = filepath
    scene.render.ffmpeg.format = 'QUICKTIME'
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    bpy.ops.ptcache.bake_all(bake=True)
    bpy.ops.render.render(animation=True, scene=bpy.context.scene.name)

class Camera:
    def __init__(self):
        bpy.ops.object.camera_add(enter_editmode=False, align='VIEW', location=(0, -15, 1), rotation=(1.5708, 0.0, 0), scale=(1, 1, 1))
        self.object = bpy.context.active_object

class Light:
    def __init__(self):
        bpy.ops.object.light_add(type='AREA', radius=1, align='WORLD', location=(0, 0, 0), scale=(1, 1, 1))
        self.object = bpy.context.active_object
        self.object.data.size = 10
        self.object.location[2] = 10
        self.object.data.energy = 1000

class FrontOrthoCamera:
    def __init__(self, point_of_focus):
        print(f'got point_of_focus {point_of_focus[0]}')
        bpy.ops.object.camera_add(enter_editmode=False, align='VIEW', location=(point_of_focus[0], -15, point_of_focus[2]), rotation=(1.5708, 0.0, 0), scale=(1, 1, 1))
        self.object = bpy.context.active_object

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

#     def add_noise():
#         noise = mat_nodes.new('ShaderNodeTexNoise')
# noise.inputs['Detail'].default_value = 5.0
# cur_frame = bpy.context.scene.frame_current
# noise.inputs['Detail'].keyframe_insert('default_value', frame=cur_frame)
#
# mat_links.new(noise.outputs['Color'], diffuse.inputs['Color'])


def simple_add_material(obj, mat):
    if len(obj.material_slots) == 0:
        bpy.ops.object.material_slot_add()
    obj.material_slots[0].material = mat

class SimpleGround:
    def __init__(self):
        bpy.ops.mesh.primitive_plane_add(size=50, location=(0,0,0))
        self.object = bpy.context.active_object
        bpy.ops.rigidbody.object_add()
        bpy.context.object.rigid_body.type = 'PASSIVE'
