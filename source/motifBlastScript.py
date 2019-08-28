# coding=gbk
import sys
import os
import requests
import queue
#�õ�flagment ��overlap score
class Get_Spec:
    def __init__(self, mzmlFile, motif_sets, queue):
        self.mzmlFile = mzmlFile
        self.motif_sets = motif_sets
        self.queue = queue

    def get_doc_score_from_server(self):
        abs_path = os.path.abspath(__file__)#��ȡ��ǰ·�������䲻ͬ��·��
        abs_path = "\\".join(abs_path.split("\\")[:-1])
        sys.path.append(abs_path)
        input_file = self.mzmlFile
        from source.ms2lda_feature_extraction import LoadMZML, MakeBinnedFeatures
        # LDA
        from source.lda import VariationalLDA
        l = LoadMZML()
        # ����mzml�ļ�������ms1, ms2, metadata
        ms1, ms2, metadata = l.load_spectra([input_file])
        print(ms1)
        print(metadata)
        m = MakeBinnedFeatures()
        corpus, features = m.make_features(ms2)
        server_url = "http://ms2lda.org"
        # Get the list of motif sets
        output = requests.get(server_url + '/motifdb/list_motifsets')
        motifset_list = output.json()
        print(motifset_list)  # �޸�
        # Get a token
        url = server_url + '/motifdb/initialise_api'
        client = requests.session()
        token = client.get(url).json()['token']
        url = server_url + '/motifdb/get_motifset/'
        data = {'csrfmiddlewaretoken': token}
        id_list = []
        # ������ݿ�ȡ���
        for motif_set in self.motif_sets:
            id_list.append(motifset_list[motif_set])
        data['motifset_id_list'] = id_list
        data['filter'] = "True"
        # data['filter_threshold'] = 0.95 # Default value - not required
        output = client.post(url, data=data).json()
        print(len(output['motifs']), len(output['metadata']))#�޸�
        print(output['motifs'])
        for motif_name in output['motifs']:
            # print(motif_name)

            motif_of_interest = {motif_name: output['motifs'][motif_name]}
            motif_of_interest_metadata = {motif_name: output['metadata'][motif_name]}

            # set weight to zero for all docs with no overlapping features
            weights = {}
            sub_corpus = {}
            mf = set(motif_of_interest[motif_name].keys())
            for document, features in corpus[list(corpus.keys())[0]].items():#����list
                precursor = metadata[document]['precursor_mass']
                if 300 < precursor < 370:
                    fs = set(features.keys())
                    if len(mf.intersection(fs)) == 0:
                        weights[document] = 0
                    else:
                        sub_corpus[document] = features
                else:
                    weights[document] = 0
            print(len(sub_corpus))
            vlda = VariationalLDA(sub_corpus, K=1, normalise=1000.0, fixed_topics=motif_of_interest, fixed_topics_metadata=motif_of_interest_metadata)
            vlda.run_vb(n_its=20, initialise=True)
            vd = vlda.make_dictionary()
            print("vd-------------------")
            print(vd['topic_metadata'].get(motif_name, 0))
            print(vd['topic_index'])
            for document in sub_corpus:
                weights[document] = vd['overlap_scores'][document].get(motif_name, 0)
            wz = zip(weights.keys(), weights.values())
            wz = list((sorted(wz, key=lambda x: x[1], reverse=True)))  # ����ת��Ϊ�б�
            motif_name = motif_name + ": "
            wz.insert(0, motif_name)
            wz = wz[: 4]
            # �ܵ���������������·��
            self.queue.put(wz)
def run(mzmlFile, motif_sets, queue):
    get_spec = Get_Spec(mzmlFile, motif_sets, queue)
    get_spec.get_doc_score_from_server()


if __name__ == '__main__':
    motif_sets = ['Massbank library derived Mass2Motifs']
    mzmlFile = 'C:\\Users\\lin\\PycharmProjects\\mzmlProject\\Beer_multibeers_1_T10_POS(2).mzML'
    # Get_Spec(mzmlFile,motif_sets)
    # get_doc_score_from_server(mzmlFile, motif_sets)
























