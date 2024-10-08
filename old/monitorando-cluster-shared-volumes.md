---
layout: ../../layouts/post.astro
title: "Monitorando Cluster Shared Volumes"
pubDate: 2017-06-26
description: "Monitorando CSVs usando Powershell"
author: "Luiz Meier"
excerpt: Neste artigo veremos como monitorar os discos de um cluster de failover Microsoft utilizando o LLD do Zabbix. Se você não sabe o que é um cluster de failover, sugiro dar uma estudada [aqui](https://technet.microsoft.com/pt-br/library/cc770737(v=ws.11).aspx). De modo geral, os discos que são apresentados a um cluster possuem um "dono". Isso quer dizer que a propriedade de leitura e gravação naquele disco é de um dos nós do cluster, e somente dele. Com o recurso de CSV (Cluster Shared Volumes), ou volumes compartilhados do cluster, é possível que dois ou mais nós do cluster gravem dados em um mesmo volume ao mesmo tempo. Isso também agiliza o processo de failover, pois não é necessária a montagem e desmontagem do volume para a troca de propriedade. Mais informações sobre CSV [aqui](https://msdn.microsoft.com/pt-br/library/jj612868(v=ws.11).aspx) 
image:
  src:
  alt:
tags: 
- CSV
- LLD
- Zabbix
- Cluster
- Windows Server
---

Olá!  
  
Neste artigo veremos como monitorar os discos de um cluster de failover Microsoft utilizando o LLD do Zabbix. Se você não sabe o que é um cluster de failover, sugiro dar uma estudada [aqui](https://technet.microsoft.com/pt-br/library/cc770737(v=ws.11).aspx).  
  
De modo geral, os discos que são apresentados a um cluster possuem um "dono". Isso quer dizer que a propriedade de leitura e gravação naquele disco é de um dos nós do cluster, e somente dele. Com o recurso de CSV (Cluster Shared Volumes), ou volumes compartilhados do cluster, é possível que dois ou mais nós do cluster gravem dados em um mesmo volume ao mesmo tempo. Isso também agiliza o processo de failover, pois não é necessária a montagem e desmontagem do volume para a troca de propriedade. Mais informações sobre CSV [aqui](https://msdn.microsoft.com/pt-br/library/jj612868(v=ws.11).aspx)  
  
Um dos pequenos "problemas" de se usar CSV é que o cluster simplesmente consome o volume e direciona-o para um diretório em C:\\ClusterStorage\\VolumeX, com X sendo incrementado a cada novo volume adicionado aos CSV.  
  
Levando em conta que não poderíamos simplesmente monitorar os discos naturalmente através das chaves padrão do Zabbix (pois os discos não "existem" mais!), só nos restou desenvolver um script para coletar estes dados de forma dinâmica, através do LLD. Você pode baixá-lo [aqui](https://github.com/LuizMeier/Zabbix/tree/master/ClusterSharedVolume). Depois de baixá-lo, salve-o em um diretório de sua escolha.  


### 1) Testando o script

A maioria dos scripts que acabo criando para fazer LLD fazem a descoberta quando executados sem parâmetro algum. Quando executado dessa forma, lista todos os discos CSV do seu cluster e formata a saída em formato JSON, utilizando a macro {#VOLNAME} para cada disco descoberto. É com base no valor dessa macro que o nome do disco será adicionado ao item de monitoramento e depois também utilizado nas coletas.  

> ```powershell
> C:\caminho\do\seu\script\MonitorCSV.ps1
> ```

![](../../../public/csv/1.png)

  
Acima vemos que o script encontrou somente 1 disco adicionado ao cluster em modo CSV.  
  
Explore o script para descobrir que ele aceita 4 argumentos: used, free, pfree e total. Por exemplo, se quiser saber o tamanho total do disco 11, execute o comando a seguir:  

> ```powershell
> C:\caminho\do\seu\script\MonitorCSV.ps1 "Cluster Disk 11" total
> ```

![](../../../public/csv/2.png)


### 2) Adicionando o script ao Zabbix

Eu disponibilizei um template [aqui](https://github.com/LuizMeier/Zabbix/blob/master/CSV/Template_CSV.xml) para monitoramento, mas abaixo segue como criar a regra de descoberta:  

*   a) Primeiro vamos criar a regra de descoberta em si, que consumirá os dados gerados no arquivo JSON. Isto processará periodicamente todos os volumes disponíveis. Caso um novo seja encontrado, os itens serão criado também para este novo item.

![](../../../public/csv/3.png)

*   b) Agora criaremos os itens. Abaixo segue os detalhes de cada item que criei. O LLD criará novos itens iguais a esse para cada volume que encontrar.

![](../../../public/csv/4.png)

  
![](../../../public/csv/5.png)
  

*   c) Agora criaremos os protótipos de trigger em seguida gráficos:

![](../../../public/csv/6.png)

  
![](../../../public/csv/7.png)

Dessa forma, todos estes elementos serão criados para cada novo disco adicionado de forma dinâmica, sem a necessidade de ter que criá-los manualmente.  
  
Espero que seja útil.  
  
Grande Abraço!