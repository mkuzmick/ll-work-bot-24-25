#! /usr/bin/env zsh

BLENDER_WORK_FOLDER="$HOME/Desktop/project-blender-py/blender-work"
RENDER_FOLDER="$HOME/Desktop/project-blender-py/renders/scripted/20200912"
TEMPLATE_FOLDER="$HOME/Desktop/project-blender-py/blender-templates"
PROJECT_FOLDER="$HOME/Desktop/project-blender-py/scripts/projects/name_drop"
PYTHON_SCRIPT="$PROJECT_FOLDER/main_script.py"

CURRENT_TIME=$(date "+%Y%m%d%H%M%S")
OUTPUT_PATH="$BLENDER_WORK_FOLDER/name-drop-$NAME_TO_DROP-$CURRENT_TIME.blend"
RENDER_PATH_STEM="$RENDER_FOLDER/scripted/name-drop-$NAME_TO_DROP-render-$CURRENT_TIME-"
TEMPLATE="$TEMPLATE_FOLDER/moving-cam.blend"
DATE_FOR_TEXT=$(date "+%Y%m%d")
TIME_FOR_TEXT=$(date "+%H:%M:%S")
NAME_TO_DROP=$1

echo "going to drop the name $NAME_TO_DROP"

# /Applications/Blender.app/Contents/MacOS/blender $TEMPLATE --background --python $PYTHON_SCRIPT -- --NAME_TO_DROP="$NAME_TO_DROP"  --OUTPUT_PATH="$OUTPUT_PATH" --RENDER_PATH="$RENDER_PATH"
/Applications/Blender.app/Contents/MacOS/blender --background --python $PYTHON_SCRIPT -- --NAME_TO_DROP="$NAME_TO_DROP"  --OUTPUT_PATH="$OUTPUT_PATH" --RENDER_PATH="$RENDER_PATH_STEM"

# open "$OUTPUT_PATH" -a Blender
# open $RENDER_PATH -a Preview
# /Applications/Blender.app/Contents/MacOS/blender $TEMPLATE --python $PYTHON_SCRIPT --  --SHOOT_DATE="$DATE_FOR_TEXT" --SHOOT_TIME="$TIME_FOR_TEXT" --OUTPUT_PATH="$OUTPUT_PATH" --RENDER_PATH="$RENDER_PATH"

# or render from the shell script once file is created?

# set active scene with


# /Applications/Blender.app/Contents/MacOS/blender -b $OUTPUT_PATH -E CYCLES -F PNG -t 4 -o $RENDER_PATH_STEM -a
