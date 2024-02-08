#include <iostream>
#include <fstream>
using namespace std;

int main(){
    int n,nr=0,p=1;
    cin>>n;
    while(n!=0){
        nr=nr+p*(n%4);
        p=p*10;
        n=n/4;
    }
    cout<<nr;
}