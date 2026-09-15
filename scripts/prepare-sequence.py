#!/usr/bin/env python3
"""Convert an approved continuous MP4 into responsive frames and enable the site film.
Usage: python scripts/prepare-sequence.py path/to/master.mp4
Requires ffmpeg and ffprobe. Run from the project root. Rebuild after conversion.
"""
import argparse, json, shutil, subprocess, tempfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('video',type=Path);args=p.parse_args()
source=args.video.resolve()
if not source.is_file(): p.error('Video file not found.')
for program in ('ffmpeg','ffprobe'):
    if not shutil.which(program):p.error(f'{program} must be installed.')
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(source)],text=True))
duration=float(info['format']['duration'])
if not 2 <= duration <= 60:p.error('Use a 2–60 second continuous master.')
root=Path(__file__).resolve().parents[1];dest=root/'public'/'sequence';dest.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(prefix='ikhaya-frames-') as tmp:
    stage=Path(tmp)
    for variant,width,quality in [('desktop',1280,74),('mobile',480,70)]:
        out=stage/variant;out.mkdir()
        filter_chain=f'fps=12,scale={width}:-2' if variant=='desktop' else fr"fps=12,crop=ih*9/16:ih:(iw-ow)*(0.68-0.18*min(t/12\,1)):0,scale={width}:-2"
        subprocess.run(['ffmpeg','-v','error','-threads','2','-i',str(source),'-an','-vf',filter_chain,'-c:v','libwebp','-quality',str(quality),str(out/'frame-%04d.webp')],check=True)
    count=len(list((stage/'desktop').glob('frame-*.webp')))
    if count<2 or count!=len(list((stage/'mobile').glob('frame-*.webp'))):raise RuntimeError('Frame counts are invalid or inconsistent.')
    # These stops give visitors a pause to read at each main chapter.
    stops=[{'scroll':s,'frame':round(f*(count-1))} for s,f in [(0,0),(.06,0),(.28,.3976),(.36,.5567),(.45,.5567),(.61,.8748),(.74,.8748),(.92,1),(1,1)]]
    for variant in ('desktop','mobile'):
        target=dest/variant
        if target.exists():shutil.rmtree(target)
        shutil.copytree(stage/variant,target)
    manifest={'enabled':True,'count':count,'fps':12,'desktop':'/sequence/desktop/frame-{frame}.webp','mobile':'/sequence/mobile/frame-{frame}.webp','stops':stops}
    temp=dest/'manifest.tmp';temp.write_text(json.dumps(manifest,indent=2)+'\n');temp.replace(dest/'manifest.json')
    total=sum(f.stat().st_size for f in dest.rglob('*.webp'))
    print(f'Prepared {count} frames per size, {total/1024/1024:.1f} MB total. Rebuild to activate. Review and tune timeline stops to the actual footage.')
