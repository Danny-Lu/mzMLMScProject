# coding=utf-8
import sys
import os
from bokeh.embed import components
from bokeh.models import HoverTool, ColumnDataSource
from django.shortcuts import render
import threading
import queue
from django.http import JsonResponse
from django.shortcuts import render_to_response
from bokeh.plotting import figure, output_file

abs_path = os.path.abspath(__file__)
abs_path = "\\".join(abs_path.split("\\")[:-2]) + "\\source"
print(abs_path)
sys.path.append(abs_path)
que = queue.Queue()
from source.motifBlastScript import run
ms_list = []
x_list = []
y_list = []
motifs = []
m2m_list = []
radiis = []
colors = []
overlap_scores = []

def get_data(request):
    return render_to_response("search/search.html")
#Data analysis, client access, open thread run count
#According to the analysis program motifBlastScript.py, the thread is returned to the front end through the pipeline communication analysis result.

def data_analyse(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('file')
        if file_obj:
            motifs_name = request.POST.get('motifs_name')
            file_path = file_obj.temporary_file_path()
            motifs_name = motifs_name.split(',')
            data_pro = threading.Thread(target=run, args=[file_path, motifs_name, que])
            data_pro.start()
            result = que.get()
            ms_list.append(result)
            print(result)
            result_str = ""
            motif_m2m = result[0]
            for i in range(len(result)):
                if i == 0:
                    continue
                mz_rt = list(result[i])[0].split('_')
                overlap_score = str(list(result[i])[1])
                y = mz_rt[0]
                x = mz_rt[1]
                result_str = result_str + "M/Z:" + y + "\t" + " RT:" + x + "\t" + " Overlap:" + overlap_score + "\n"
            result = motif_m2m + "\n" + result_str + "\n\n"
            result = {"info": result}
            return JsonResponse(result)
        else:
            result = que.get()
            ms_list.append(result)
            result_str = " "
            motif_m2m = result[0]
            for i in range(len(result)):
                if i == 0:
                    continue
                mz_rt = list(result[i])[0].split('_')
                overlap_score = str(list(result[i])[1])
                y = mz_rt[0]
                x = mz_rt[1]
                result_str = " M/Z:" + y + "\t" + " RT:" + x + "\t" + " Overlap:" + overlap_score + "\t" + "\n" + result_str
            result = motif_m2m + "\n" + result_str + "\n\n"
            result = {"info": result}
            return JsonResponse(result)
        #Draw
    else:
        for ms in ms_list:
            global radiis
            global script
            global div
            motif = (ms[0].split("_")[0])
            motifs.append(motif)
            motif_m2m = ms[0].split(".")[0]
            m2m_list.append(motif_m2m)
            x_y = list(ms[1])[0].split("_")
            overlap_score = float(list(ms[1])[1])
            overlap_scores.append(overlap_score)
            x = x_y[1]
            x_list.append(float(x))
            y = x_y[0]
            y_list.append(float(y))
            if motif == 'urine':
                color = '#972296'
                colors.append(color)
            elif motif == 'gnps':
                color = '#763796'
            elif motif == 'euphorbia':
                color = '#c16d96'
            elif motif == 'mb':
                color = '#82d196'
            elif motif == 'rhabdus':
                color = '#ea9196'
            else:
                color = '#57e096'
            colors.append(color)
            radiis.append(200)
        return JsonResponse({"hello": "hello"})

def ms_scatter(request):
    data = {
        "motifs": motifs,
        "fragment": m2m_list,
        "x_list": x_list,
        "y_list": y_list,
        "radius": radiis,
        "colors": colors,
        "overlap_score": overlap_scores
    }
    source = ColumnDataSource(data)
    hover1 = HoverTool(tooltips=[("(x, y)", "($x, $y)"),
                                ("motifs", "@motifs"),
                                 ("fragment", "@fragment"),
                                 ("overlap_score", "@overlap_score")])
    TOOLS = "pan,wheel_zoom,zoom_in,zoom_out,box_zoom,undo," \
            "redo,reset,tap,save,box_select,poly_select,lasso_select,"
    p = figure(tools=TOOLS, width=1200, height=600, x_axis_label="RT", y_axis_label="M/Z")
    p.scatter(x="x_list", y="y_list", source=source, radius="radius",
              fill_color="colors", fill_alpha=0.6,
              line_color=None)
    p.add_tools(hover1)
    output_file("color_scatter.html", title="color_scatter.py example")
    script, div = components(p)
    return render(request, "search/scatter.html", {'script': script, 'div': div})
