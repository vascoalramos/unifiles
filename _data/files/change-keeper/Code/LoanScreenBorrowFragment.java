package com.example.changekeeper;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;

import static android.support.constraint.Constraints.TAG;

public class LoanScreenBorrowFragment extends Fragment {

    ViewGroup thisView;
    private ArrayList<String> loans = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        thisView = (ViewGroup) inflater.inflate(
                R.layout.fragment_info_table, container, false);

        loadLoans();

        if(this.loans!=null && this.loans.size()!=0){
            LinearLayout ll;
            ll = (LinearLayout) thisView.findViewById(R.id.noInfoLayout);
            ll.removeAllViewsInLayout();
        }else{
            TextView text = (TextView) thisView.findViewById(R.id.noAllowance1);
            text.setText("You haven't borrowed any money");
            text = (TextView) thisView.findViewById(R.id.noAllowance2);
            text.setText(":D");
        }

        sortInfoByDate();

        ImageButton search = (ImageButton) thisView.findViewById(R.id.searchButton);
        search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SearchDialog2 searchDialog = SearchDialog2.newInstance();
                searchDialog.show(getActivity().getSupportFragmentManager(), "Search Dialogue");
            }
        });

        drawTable();

        return thisView;
    }


    private ArrayList<String> loadLoans() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserBorrows.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            ArrayList<String> ourRegs = new ArrayList<>();
            String line;

            //Format: ID - WALLET/CARD - Amount - Person - Date - Description
            while ((line = bufferedReader.readLine()) != null) {
                ourRegs.add(line);
                this.loans.add(line);
            }


        }catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }



    private void drawTable(){
        RecyclerView recyclerView = thisView.findViewById(R.id.infoTable);

        RecyclerViewAdapter adapter = new RecyclerViewAdapter(this.loans,getActivity());

        recyclerView.setAdapter(adapter);

        recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
    }

    private boolean compareDate(String date1, String date2){
        Calendar cal1 = Calendar.getInstance();
        cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(date1.split("/")[0]));
        cal1.set(Calendar.MONTH,Integer.parseInt(date1.split("/")[1])-1);
        cal1.set(Calendar.YEAR,Integer.parseInt(date1.split("/")[2]));

        Calendar cal2 = Calendar.getInstance();
        cal2.set(Calendar.DAY_OF_MONTH,Integer.parseInt(date2.split("/")[0]));
        cal2.set(Calendar.MONTH,Integer.parseInt(date2.split("/")[1])-1);
        cal2.set(Calendar.YEAR,Integer.parseInt(date2.split("/")[2]));

        return cal1.after(cal2); //True if cal 1 is sooner than cal2
    }

    private void sortInfoByDate(){
        for (int i = 1; i < this.loans.size(); i++) {
            String key = this.loans.get(i);
            int j = i - 1;
            while (j >= 0 && compareDate(this.loans.get(j).split(" - ")[2],key.split(" - ")[2])) {
                int k = j+1;
                this.loans.set(k,this.loans.get(j));
                j = j - 1;
            }
            int k = j + 1;
            this.loans.set(k,key);
        }
    }


    public void search(String date, String desc) {
        Log.i("Oi","boi");
        this.loans.clear();
        loadLoans();

        if(this.loans.size() == 0){
            return;
        }

        if(!date.equals("NULL")){

            Log.i("boi","boi" + date);
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            String current = day + "/" + month + "/" + year;
            switch (date){
                case "TODAY":
                    for(int i = 0 ; i < this.loans.size() ; i++){
                        String line = this.loans.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2]);
                        if(line.split(" - ")[2].equals(current))
                            continue;
                        else{
                            this.loans.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                case "YEAR":
                    for(int i = 0 ; i < this.loans.size() ; i++){
                        String line = this.loans.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2].split("/")[2]);
                        Log.i("hm","boiiob" + year);
                        String thisYear = line.split(" - ")[2].split("/")[2];
                        if(thisYear.equals(year+"")){
                            Log.i("hm","hi" + year);
                            continue;
                        }
                        else{
                            this.loans.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                case "MONTH":
                    for(int i = 0 ; i < this.loans.size() ; i++){
                        String line = this.loans.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2]);
                        Log.i("hm","boiiob" + month);

                        if(line.split(" - ")[2].split("/")[1].equals(month+""))
                            continue;
                        else{
                            this.loans.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                default:
                    for(int i = 0 ; i < this.loans.size() ; i++){
                        String line = this.loans.get(i);
                        if(line.split(" - ")[2].equals(date))
                            continue;
                        else{
                            this.loans.remove(line);
                            i = i-1;
                        }
                    }
                    break;

            }
        }


        if(!desc.equals("")){
            for(int i = 0 ; i < this.loans.size() ; i++){
                String line = this.loans.get(i);
                if(line.split(" - ")[8].contains(desc))
                    continue;
                else {
                    this.loans.remove(line);
                    i = i - 1;
                }
            }
        }

        if(this.loans!=null && this.loans.size()!=0){
            LinearLayout ll;
            ll = (LinearLayout) thisView.findViewById(R.id.noInfoLayout);
            ll.setVisibility(View.GONE);
        }else{
            LinearLayout ll;
            ll = (LinearLayout) thisView.findViewById(R.id.noInfoLayout);
            ll.setVisibility(View.VISIBLE);
            TextView text = (TextView) thisView.findViewById(R.id.noAllowance1);
            text.setText("No registry were found with those parameters");
            text = (TextView) thisView.findViewById(R.id.noAllowance2);
            text.setText(":/");
        }

        sortInfoByDate();
        drawTable();
    }


}
