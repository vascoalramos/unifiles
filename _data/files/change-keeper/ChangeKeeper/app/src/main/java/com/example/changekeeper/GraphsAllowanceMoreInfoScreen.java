package com.example.changekeeper;

import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;

public class GraphsAllowanceMoreInfoScreen extends AppCompatActivity implements DeleteDialog.DeleteDialogListener {

    private static final String TAG = "AllowanceInfo";

    private String info;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        this.info = intent.getStringExtra(RecyclerViewAdapter.EXTRA_MESSAGE);
        String[] details = this.info.split( " - ");

        ActionBar toolbar = getSupportActionBar();
        setContentView(R.layout.layout_more_dialogue_allowance);



        toolbar.setTitle("More Income Details");

        //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description

        TextView text = findViewById(R.id.amountText);
        text.setText(details[1] + "€");

        if(details[1].contains("-")){
            text.setTextColor(Color.parseColor("#e74c3c"));
        }else{
            text.setTextColor(Color.parseColor("#2ecc71"));
        }

        text = findViewById(R.id.descriptionText);
        text.setText(details[8]);

        text = findViewById(R.id.fromInput);
        text.setText(details[2]);

        text = findViewById(R.id.destText);
        text.setText(details[0]);

        if(!details[5].equals("NULL")){
            text = findViewById(R.id.payDay);
            text.setText(details[6] + " " + details[5]);

            String next = calcNextDate(details[2],details[6],details[5]);

            text = findViewById(R.id.typeText);
            text.setText(next);

        }else{
            text = findViewById(R.id.payDay);
            text.setText("Does not repeat");
            text = findViewById(R.id.typeText);
            text.setText("");
            text = findViewById(R.id.type);
            text.setText("");
        }

    }


    private ArrayList<String> readFile() {
        try {
            FileInputStream fileInputStream = openFileInput("UserIncomes.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            ArrayList<String> updatedAllowances = new ArrayList<>();
            Boolean found = false;
            String line;

            //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description
            while((line = bufferedReader.readLine()) != null){
                if(!found && line.equals(info)){
                    found = true;
                    continue;
                }
                updatedAllowances.add(line);
            }

            bufferedReader.close();

            return updatedAllowances;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public void deleteThis(View view) throws IOException {
        DeleteDialog deleteDialog = DeleteDialog.newInstance();
        deleteDialog.show(getSupportFragmentManager(), "Delete Dialogue");
    }

    @Override
    public void confirm() {
        try {
            updateFile(readFile());
        } catch (IOException e) {
            e.printStackTrace();
        }

        Intent intent = new Intent(this, GraphsScreen.class);

        Toast toast = Toast.makeText(this,"Income deleted successfully!", Toast.LENGTH_LONG);
        toast.show();
        startActivity(intent);
    }

    private void updateFile(ArrayList<String> newList) throws IOException {
        FileOutputStream fileOutputStream = openFileOutput("UserIncomes.txt", MODE_PRIVATE);
        for(int k = 0 ; k < newList.size() ; k++){
            fileOutputStream.write((newList.get(k)+"\n").getBytes());
        }

        fileOutputStream.close();


    }

    private String calcNextDate(String dateOfReg,String frequency, String type){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH,Integer.parseInt(dateOfReg.split("/")[0]));
        cal.set(Calendar.MONTH,Integer.parseInt(dateOfReg.split("/")[1])-1);
        cal.set(Calendar.YEAR,Integer.parseInt(dateOfReg.split("/")[2]));

        Calendar current = Calendar.getInstance();


        switch(type){
            case "Day":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.DAY_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Week":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.WEEK_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Month":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Year":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.YEAR, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
        }

        //Add support for weekdays
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);

        String date = day+"/"+month+"/"+year;

        return date;
    }
}
