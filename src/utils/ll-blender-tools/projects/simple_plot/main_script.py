import bpy
import json
import os
import sys
sys.path.append(os.getcwd())
import mk_blender_utilities as mk
import plot_xy
import parse_arguments as pa
import requests_test

def main():
    mk.clear_scene()
    the_args=pa.parse(sys.argv)
    # with open(f'{os.getcwd()}/data.json') as data_file:
    #     data = json.load(data_file)
    # point_objects=[]
    # for i, point in enumerate(data):
    #     point_objects.append(plot_xy.Sphere(f'point-{i}-x-{point["x"]}-y-{point["y"]}', point["x"], point["y"], 0, .5))
    requests_test.get_stock_data("AAPL", the_args.FINNHUB_APIKEY)

    bpy.ops.wm.save_as_mainfile(filepath=the_args.OUTPUT_PATH)

if __name__ == "__main__":
    main()
