Info how to run local Kubernetes cluster with Vagrant

Prerequisites:

- <a href="https://www.virtualbox.org/">Virtualbox</a>
- <a href="https://www.vagrantup.com/">Vagrant</a>
- 8+ CPU

<br/ >

##### Run VM cluster

- Start Vagrant <br />
  `vagrant up`<br />

<br />

##### Check cluster nodes <br />

`kubectl get nodes`<br />
`kubectl cluster-info`<br />

<br />

##### Set up TypeScript server from docker registry <br />

`kubectl apply -f server/server-service.yaml`<br />
`kubectl apply -f server/server-deployment.yaml`<br />
`kubectl apply -f server/server-env-configmap.yaml`<br />
Check status: `kubectl get all` <br />
Go to: http://kworker1.example.com:31000 | http://kworker2.example.com:31000

<br />

##### Set up <a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">k8s Dashboard</a> <br />

Get token.. <br />
`kubectl apply -f k8sdashboard/sa-cluster-admin-dashboard.yaml`<br />
Go to https://kworker1:32323

<br />

##### Set up helm

- Install <a href="https://github.com/helm/helm/releases/tag/v2.16.1">helm</a>
- Create tiller service account: `kubectl -n kube-system create serviceaccount tiller`
- Create cluster role binding: `kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller`
- Check tiller role: `kubectl get clusterrolebinding tiller` <br>
  ~>> `NAME AGE ~>> tiller 4h`
- Provide tiller root service account: `helm init --service-account tiller`
- Check pods in kube-system namespace: `kubectl -n kube-system get pods`
  ~>> `tiller-deploy-969865475-q9645 1/1 Running 0 49s`

<br/>

##### Set up <a href="https://prometheus.io/">Prometheus</a> in cluster using helm-v2

- Deploy dynamic NFS provisioner:
  - Replace `<< NFS Server IP>>` with your NFS Persistent Volume server ip in `/prometheus/deployment.yaml`
  - `kubectl apply -f prometheus/class.yaml`<br />
  - `kubectl apply -f prometheus/rbac.yaml`<br />
  - `kubectl apply -f prometheus/deployment.yaml`<br />
- Check created storageclass: `kubectl get storageclass` <br>
  ~>> managed-nfs-storage (default) example.com/nfs 105m
- Check pods: `kubectl -n kube-system get pods`
  ~>> tiller-deploy-969865475-q9645 1/1 Running 0 26m
- Download prometheus: `helm inspect values stable/prometheus > /tmp/prometheus.values`
- Replace `type: ClusterIP` with `type: NodePort` at external IPs; set nodePort to 32322 in `/tmp/prometheus.values`
- Install Prometheus with your NFS server: `helm install stable/prometheus --name prometheus --values /tmp/prometheus.values --namespace prometheus`
- Install Grafana...

Go to http://kworker1.example.com:30900/graph

#### Set up prometheus & grafana v2

Apply all prometheus-v2 files; Go tohttp://kworker1.example.com:32767/graph | http://kworker2.example.com:32767/graph
Apply all grafana files; Go to http://kworker1.example.com:32766/login | http://kworker2.example.com:32766/login; (admin / password)

Set up <a href="https://prometheus.io/docs/guides/node-exporter/">node exporter</a>

vagrant ssh kmaster

`sudo yum install wget`
`wget https://github.com/prometheus/node_exporter/releases/download/v0.16.0/node_exporter-0.16.0.linux-amd64.tar.gz`
`tar xvfz node_exporter-0.16.0.linux-amd64.tar.gz`
`cd node_exporter-0.16.0.linux-amd64/`
Check `./node_exporter`
Set as systemctl service:
`sudo vi /etc/systemd/system/node_exporter.service`:

<pre>
[Unit]
Description=Node Exporter

[Service]
User=vagrant
ExecStart=/home/vagrant/node_exporter-0.16.0.linux-amd64/node_exporter

[Install]
WantedBy=default.target
</pre>

`sudo systemctl daemon-reload`
`sudo systemctl enable node_exporter.service`
`sudo systemctl start node_exporter.service`
`sudo systemctl status node_exporter.service`
Go to
