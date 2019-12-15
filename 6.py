list=[0,1,2]
i=0
for i in range(3):
  
  l=list[i]
  del list[i]
  i=0
  for i in range(2):
    
    j=list[i]
    del list[i]
    i=0
    for i in range(1):
      k=list[i]
      print(l,j,k)
    
    
      list=[0,1,2]