package com.example.changekeeper;

import android.app.DatePickerDialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
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
import java.time.Year;
import java.util.ArrayList;
import java.util.Calendar;

import static android.support.constraint.Constraints.TAG;

public class AllInfoFragment extends Fragment{

    ViewGroup thisView;

    private ArrayList<String> all = new ArrayList<>();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        thisView = (ViewGroup) inflater.inflate(
                R.layout.fragment_info_table, container, false);

        loadIncomes();
        loadExpenses();
        loadLoans();

        if(this.all!=null && this.all.size()!=0){
            LinearLayout ll;
            ll = (LinearLayout) thisView.findViewById(R.id.noInfoLayout);
            ll.setVisibility(View.GONE);
        }else{
            LinearLayout ll;
            ll = (LinearLayout) thisView.findViewById(R.id.noInfoLayout);
            ll.setVisibility(View.VISIBLE);
            TextView text = (TextView) thisView.findViewById(R.id.noAllowance1);
            text.setText("You haven't registered any transactions");
            text = (TextView) thisView.findViewById(R.id.noAllowance2);
            text.setText(":O");
        }

        sortInfoByDate();
        for (String i : this.all)
            Log.i(TAG,"oof " + i);
        drawTable();

        ImageButton search = (ImageButton) thisView.findViewById(R.id.searchButton);
        search.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SearchDialog searchDialog = SearchDialog.newInstance();
                searchDialog.show(getActivity().getSupportFragmentManager(), "Search Dialogue");
            }
        });

        return thisView;
    }

    private void loadIncomes() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserIncomes.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            String line;

            //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description
            while((line = bufferedReader.readLine()) != null){
                this.all.add(line);
                /*for (String i : this.all)
                    Log.i(TAG,"oof " + i);*/
            }

            bufferedReader.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private ArrayList<String> loadExpenses() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserExpenses.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            ArrayList<String> ourSubscriptions = new ArrayList<>();
            String line;

            //Format: ID - WALLET/CARD - Amount - Date - Person(NULL) - Category - FrequencyType - Frequency - Weekdays - Description
            while((line = bufferedReader.readLine()) != null){
                this.all.add(line);
                ourSubscriptions.add(line);
            }

            bufferedReader.close();

            return ourSubscriptions;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private ArrayList<String> loadLoans() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserBorrows.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            ArrayList<String> ourRegs = new ArrayList<>();
            String line;

            //Format: WALLET/CARD - Amount - Register Date - Person (LOANS) - Category(EXPENSES) - FrequencyType - Frequency - Weekdays - Description - PayDate(LOANS) - PAID/NOT PAID (LOANS)
            while((line = bufferedReader.readLine()) != null){
                ourRegs.add(line);
                this.all.add(line);

            }

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try{
            FileInputStream fileInputStream = getActivity().openFileInput("UserLends.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            String line;

            //Format: WALLET/CARD - Amount - Register Date - Person (LOANS) - Category(EXPENSES) - FrequencyType - Frequency - Weekdays - Description - PayDate(LOANS) - PAID/NOT PAID (LOANS)
            while((line = bufferedReader.readLine()) != null){
                this.all.add(line);

            }

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private void drawTable(){
        RecyclerView recyclerView = thisView.findViewById(R.id.infoTable);
        RecyclerViewAdapter adapter = new RecyclerViewAdapter(this.all,getActivity());
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
        for (int i = 1; i < this.all.size(); i++) {
            String key = this.all.get(i);
            int j = i - 1;
            while (j >= 0 && compareDate(this.all.get(j).split(" - ")[2],key.split(" - ")[2])) {
                int k = j+1;
                this.all.set(k,this.all.get(j));
                j = j - 1;
            }
            int k = j + 1;
            this.all.set(k,key);
        }
    }


    public void search(String date, String type, String desc) {
        Log.i("Oi","boi");

        this.all.clear();

        loadIncomes();
        loadExpenses();
        loadLoans();

        if(this.all.size() == 0){
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
                    for(int i = 0 ; i < this.all.size() ; i++){
                        String line = this.all.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2]);
                        if(line.split(" - ")[2].equals(current))
                            continue;
                        else{
                            this.all.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                case "YEAR":
                    for(int i = 0 ; i < this.all.size() ; i++){
                        String line = this.all.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2].split("/")[2]);
                        Log.i("hm","boiiob" + year);
                        String thisYear = line.split(" - ")[2].split("/")[2];
                        if(thisYear.equals(year+"")){
                            Log.i("hm","hi" + year);
                            continue;
                        }
                        else{
                            this.all.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                case "MONTH":
                    for(int i = 0 ; i < this.all.size() ; i++){
                        String line = this.all.get(i);
                        Log.i("hm","boi" + line.split(" - ")[2]);
                        Log.i("hm","boiiob" + month);

                        if(line.split(" - ")[2].split("/")[1].equals(month+""))
                            continue;
                        else{
                            this.all.remove(line);
                            i = i-1;
                        }
                    }
                    break;

                default:
                    for(int i = 0 ; i < this.all.size() ; i++){
                        String line = this.all.get(i);
                        if(line.split(" - ")[2].equals(date))
                            continue;
                        else{
                            this.all.remove(line);
                            i = i-1;
                        }
                    }
                    break;

            }
        }

        if(!type.equals("NULL")){
            if(type.equals("INCOME")){
                for(int i = 0 ; i < this.all.size() ; i++){
                    String line = this.all.get(i);
                    if(line.split(" - ")[4].equals("NULL") && line.split(" - ")[3].equals("NULL")){
                        continue;
                    }else{
                        this.all.remove(line);
                        i = i-1;
                    }
                }

            }else if(type.equals("EXPENSE")){
                for(int i = 0 ; i < this.all.size() ; i++){
                    String line = this.all.get(i);
                        if(!line.split(" - ")[4].equals("NULL"))
                            continue;
                        else{
                            this.all.remove(line);
                            i = i-1;
                        }
                    }
            }else{
                for(int i = 0 ; i < this.all.size() ; i++){
                    String line = this.all.get(i);
                    if(line.split(" - ")[4].equals("NULL") && !line.split(" - ")[3].equals("NULL"))
                        continue;
                    else{
                        this.all.remove(line);
                        i = i-1;
                    }
                }
            }
        }

        if(!desc.equals("")){
            for(int i = 0 ; i < this.all.size() ; i++){
                String line = this.all.get(i);
                if(line.split(" - ")[8].contains(desc))
                    continue;
                else {
                    this.all.remove(line);
                    i = i - 1;
                }
            }
        }

        if(this.all!=null && this.all.size()!=0){
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
