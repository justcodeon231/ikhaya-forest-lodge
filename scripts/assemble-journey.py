import subprocess,argparse
from pathlib import Path
project=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,default=project/'media/originals');p.add_argument('--output',type=Path,default=project/'media/ikhaya-master.mp4');args=p.parse_args()
root=args.source
args.output.parent.mkdir(parents=True,exist_ok=True)
f=['01-forest-approach_1080p.mp4','02-enter-suite_1080p.mp4','03-pool-arrival_1080p.mp4']
cmd=['ffmpeg','-v','error','-y','-filter_complex_threads','1']
for n in f:cmd+=['-i',str(root/n)]
flt='[0:v]trim=0:10,setpts=PTS-STARTPTS,fps=24,format=yuv420p,settb=AVTB[a];[1:v]trim=0:8,setpts=PTS-STARTPTS,fps=24,format=yuv420p,settb=AVTB[b];[2:v]trim=start=2.25:end=10,setpts=PTS-STARTPTS,fps=24,format=yuv420p,settb=AVTB[c];[a][b]xfade=transition=fade:duration=0.25:offset=9.75[ab];[ab][c]xfade=transition=fade:duration=0.35:offset=17.4[out]'
subprocess.run(cmd+['-filter_complex',flt,'-map','[out]','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(args.output)],check=True)
