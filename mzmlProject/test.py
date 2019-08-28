import requests
import json

spectrum = ('spec_name', 188.0818, [(53.0384, 331117.7),
                                    (57.0447, 798106.4),
                                    (65.0386, 633125.7),
                                    (77.0385, 5916789.799999999),
                                    (81.0334, 27067.0),
                                    (85.0396, 740633.6)])

spectra = [spectrum]  # or add more to the list

args = {'spectra': json.dumps(spectra), 'motifset': 'massbank_motifset'}

url = 'http://ms2lda.org/decomposition/api/batch_decompose/'

r = requests.post(url, args)
print(r.json())
result_id = r.json()['result_id']
feature_set = r.json()['featureset']
url2 = 'http://ms2lda.org/decomposition/api/batch_results/{}/'.format(result_id)
print(url2)
r2 = requests.get(url2)
print(r2.json())

server_url = "http://ms2lda.org"

# Get the list of motif sets
output = requests.get(server_url + '/motifdb/list_motifsets')
motifset_list = output.json()
print(motifset_list)
# Get a token
url = server_url + '/motifdb/initialise_api'
client = requests.session()
token = client.get(url).json()['token']

url = server_url + '/motifdb/get_motifset/'
data = {'csrfmiddlewaretoken': token}
data['motifset_id_list'] = [motifset_list['massbank_binned_005'], motifset_list['gnps_binned_005']]
data['filter'] = "True"
# data['filter_threshold'] = 0.95 # Default value - not required
output = client.post(url, data=data).json()
print(len(output['motifs']), len(output['metadata']))