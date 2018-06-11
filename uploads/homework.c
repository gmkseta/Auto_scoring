#include<stdio.h>

int main(){
  int a,b;
  char c[10];
  //for(int i=0;i<2;i++){
    scanf(" %d %d %s\n",&a,&b,c);
    //scanf("%d\n",&j);
    printf("%d %d %d\n",a,b, a+b);
  //}
  printf("%s\n",c);
  printf("done\n");
  return 0;
}
