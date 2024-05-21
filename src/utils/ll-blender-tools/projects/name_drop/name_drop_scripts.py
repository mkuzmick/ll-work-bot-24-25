import bpy
import sys
import argparse
sys.path.append('/Users/mk/Desktop/project-blender-py/scripts/projects/name_drop')
import mk_blender_utilities as mk

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
        "-n", "--NAME_TO_DROP", dest="NAME_TO_DROP", type=str, default="name", required=False,
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

class Letter:
    def __init__(self, letter):
        self.letter = letter
        bpy.ops.object.text_add(enter_editmode=False, location=(0, 0, 0))
        self.object = bpy.context.active_object
        self.object.name=(f'{letter}-text')
        self.object.data.body=f'{letter}'
        self.object.data.size=4
        self.object.data.align_x='LEFT'
        self.object.data.extrude=.2
        self.object.data.bevel_depth=.02
        self.object.location[0] = 0
        self.object.location[1] = 0
        self.object.location[2] = 4.2
        self.object.rotation_euler[0] = 1.5708
        self.object.hide_render = False
        self.object.hide_viewport = False
        self.object.data.font=bpy.data.fonts.load("/System/Library/Fonts/Avenir Next.ttc")
        bpy.ops.object.convert(target="MESH")
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
        bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')
        bpy.ops.rigidbody.object_add()
        self.width = self.object.dimensions.x
        self.height = self.object.dimensions.y
        self.depth = self.object.dimensions.z

class Name:
    def __init__(self, name):
        self.letters = []
        self.offset = 0
        self.spacing = .05
        for num, letter in enumerate(name):
            thisLetter = Letter(letter)
            if letter=="r":
                print('changing offset for r')
                self.offset-=.15
            self.offset+=(thisLetter.width/2+self.spacing)
            thisLetter.object.location[0] = self.offset
            self.letters.append(thisLetter)
            print(f'created {thisLetter.letter} in position {num} and added to array. Width is {thisLetter.width} and we set location[0] to {self.offset}')
            self.offset+=(thisLetter.width/2+self.spacing)
            if letter=="r":
                print('changing offset for r')
                self.offset+=.1
        self.center=(self.offset/2, 0, 1.5)
