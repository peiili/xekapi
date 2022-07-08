from sys import argv
from pdf2image import convert_from_path
print(argv[2])
images = convert_from_path(argv[1],output_folder=argv[2],fmt='jpg',dpi=96,output_file=argv[3])
print(images)