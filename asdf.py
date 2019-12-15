import math

def main():
  with open('1.txt', 'r') as file:
    data = file.readlines()
    print(first(data))
    print(second(data))

def first(puzzle):
  x=0
  for el in puzzle:
    x += math.floor(int(el) / 3) - 2
  return x

def second(puzzle):
  return('todo you faggot')


main()