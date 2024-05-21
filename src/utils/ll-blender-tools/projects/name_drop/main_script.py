import bpy
import sys
sys.path.append('/Users/mk/Desktop/project-blender-py/scripts/projects/name_drop')
import mk_blender_utilities as mk
import name_drop_scripts as nd

def add_camera():
    bpy.ops.object.camera_add(enter_editmode=False, align='VIEW', location=(0, -15, 1), rotation=(1.5708, 0.0, 0), scale=(1, 1, 1))

def main():
    mk.clear_scene()
    mk.trim_scene_length(150)
    mk.use_cycles()
    the_args=nd.parse_arguments(sys.argv)
    this_name = nd.Name(the_args.NAME_TO_DROP)
    mk.make_ground_plane_collider()
    light = mk.Light()
    camera = mk.FrontOrthoCamera(this_name.center)
    mk.render_360p_video(bpy.context.scene, camera.object, "/Users/mk/Desktop/project-blender-py/renders/ffmpeg/20200912")
    bpy.ops.wm.save_as_mainfile(filepath=the_args.OUTPUT_PATH)

if __name__ == "__main__":
    main()
