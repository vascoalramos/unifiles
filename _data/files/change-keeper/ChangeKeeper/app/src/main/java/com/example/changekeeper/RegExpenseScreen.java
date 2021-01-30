package com.example.changekeeper;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.Selection;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.Spinner;
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

public class RegExpenseScreen extends AppCompatActivity implements AdapterView.OnItemSelectedListener,ConfirmDialogue.ConfirmDialogListener, ExitDialog.ExitDialogListener,FrequencyDialogue.FrequencyDialogueListener {
    public static final String EXTRA_MESSAGE = "com.example.RegExpense.MESSAGE";

    private static final String TAG = "RegExpense";
    private TextView mDisplayDate;
    private TextView mDisplayCategories;

    private DatePickerDialog.OnDateSetListener mDateSetListener;
    private int typeFlag;
    private ArrayAdapter<String> categoryAdapter;
    private ArrayAdapter<String> frequencyAdapter;
    private String[] info;
    //To save:
    //Amount
    private double amount;

    private String typeMessage;

    private String category;

    //Date

    private String date;

    //Frequency
    private String frequency;
    private ArrayList<String> weekdays;
    private String frequencyType;




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        this.typeMessage = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);
        String[] info = intent.getStringArrayExtra(CategoryScreen.EXTRA_MESSAGE);

        ActionBar toolbar = getSupportActionBar();

        setContentView(R.layout.activity_reg_expense_screen);
        category = ((TextView)findViewById(R.id.categoryPicker)).getText().toString();
        if(info!=null){
            ((TextView)findViewById(R.id.regText)).setText(info[0]);
            ((TextView)findViewById(R.id.datePicker)).setText(info[1]);
            ((TextView)findViewById(R.id.categoryPicker)).setText(info[3]);
            category = info[3];
            switch (info[3]){
                case "Non-Specified":
                    ((ImageView)findViewById(R.id.cat)).setImageResource(R.drawable.ic_other);
                    break;
                case "Recreational":
                    ((ImageView)findViewById(R.id.cat)).setImageResource(R.drawable.ic_recreational);
                    break;
                case "Food":
                    ((ImageView)findViewById(R.id.cat)).setImageResource(R.drawable.ic_food);
                    break;


                default:

                    ((ImageView)findViewById(R.id.cat)).setImageResource(R.drawable.ic_other);
                    try {
                        FileInputStream fileInputStream = null;
                        fileInputStream = openFileInput("UserCategories.txt");
                        InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);
                        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                        String line = "";
                        while ((line = bufferedReader.readLine()) != null && line != "\n") {
                            if(line.equals(info[3])){
                                int resID = getResources().getIdentifier(info[3].split(" -@OMEGALMAO@- ")[1],
                                        "drawable", getPackageName());
                                ((ImageView)findViewById(R.id.cat)).setImageResource(resID);

                                ((TextView)findViewById(R.id.categoryPicker)).setText(info[3].split(" -@OMEGALMAO@- ")[0]);

                                category = info[3];
                            }
                        }

                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }


                    break;
            }

            ((TextView)findViewById(R.id.editDescription)).setText(info[4]);
            this.typeMessage = info[5];

            ScrollView scroll = ((ScrollView)findViewById(R.id.scrollView2));
            scroll.post(new Runnable() {
                @Override
                public void run() {
                    scroll.fullScroll(ScrollView.FOCUS_DOWN);
                }
            });
        }

        switch(this.typeMessage){
            case "EXPENSE-WALLET":
                this.typeFlag = 0;
                toolbar.setTitle("Register Expense - Wallet");
                break;

            case "EXPENSE-CARD":
                this.typeFlag = 1;
                toolbar.setTitle("Register Expense - Card");
                break;

            default:
                Log.v(TAG,"wtf erro :D");
        }

        //Date
        mDisplayDate = (TextView) findViewById(R.id.datePicker);
        mDisplayDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar cal = Calendar.getInstance();
                int year = cal.get(Calendar.YEAR);
                int month = cal.get(Calendar.MONTH);
                int day = cal.get(Calendar.DAY_OF_MONTH);

                DatePickerDialog dialog = new DatePickerDialog(
                        RegExpenseScreen.this,
                        android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                        mDateSetListener,
                        year,month,day);
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.show();
            }
        });

        mDisplayCategories = (TextView) findViewById(R.id.categoryPicker);
        mDisplayCategories.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(view.getContext(), CategoryScreen.class);
                String[] message = {((TextView)findViewById(R.id.regText)).getText().toString(),
                                    ((TextView)findViewById(R.id.datePicker)).getText().toString(),
                                    ((Spinner)findViewById(R.id.frequencyPicker)).getSelectedItem().toString(),
                                    "lol",
                                    ((TextView)findViewById(R.id.editDescription)).getText().toString(),
                                    typeMessage};
                intent.putExtra(EXTRA_MESSAGE, message);
                startActivity(intent);
            }
        });

        mDateSetListener = new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker datePicker, int year, int month, int day) {
                month = month+1; //We do this cus by default January = 0
                String date = day+"/"+month+"/"+year;
                mDisplayDate.setText(date);
            }
        };

        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH)+1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        mDisplayDate.setText(day+"/"+month+"/"+year);

        EditText edt = (EditText)findViewById(R.id.regText);
        Selection.setSelection(edt.getText(), edt.getText().length());
        edt.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean hasFocus) {
                if (!hasFocus) {

                }else{
                    if(edt.getText().toString().length()>1)
                        Selection.setSelection(edt.getText(), edt.getText().length()-1);
                }

            }
        });

        edt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(edt.getText().toString().length()>1)
                    Selection.setSelection(edt.getText(), edt.getText().length()-1);


            }
        });

        edt.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count,
                                          int after) {
            }

            @Override
            public void afterTextChanged(Editable e) {
                String s = e.toString();
                if (s.length() > 0) {
                    if (!s.endsWith("€")) {
                        if (!s.equals(s + "€")) {
                            s = s.replaceAll("[^\\d.]", "");
                            edt.setText(s + "€");
                        } else {
                            edt.setSelection(s.length() - "€".length());
                        }
                    } else {
                        edt.setSelection(s.length() - "€".length());
                        if (s.equals("€")) {
                            edt.setText("");
                        }
                    }
                }

            }
        });


        //Frequency Dropdown
        String lol;
        if(info != null){
            Log.i(TAG,"FDS WTF DUDE " + info[2]);
            lol = info[2];
        }else{
            lol = "NULL";
        }

        buildFrequencySpinner(lol);
    }


    @Override
    public void onBackPressed() {
        ExitDialog exitDialog = ExitDialog.newInstance();
        exitDialog.show(getSupportFragmentManager(), "Exit Dialogue");
    }

    private void buildFrequencySpinner(String lol){
        String[] items;
        if(!lol.equals("NULL"))
            items = new String[getResources().getStringArray(R.array.frequencies).length + 1];
        else
            items = new String[getResources().getStringArray(R.array.frequencies).length];

        Log.i(TAG,"PUTAS ");

        int j = 0;
        for(int i = 0; i < getResources().getStringArray(R.array.frequencies).length-1; i++){
            items[i] = getResources().getStringArray(R.array.frequencies)[i];
            j++;
        }
        if(!lol.equals("NULL"))
            items[j] = lol;

        items[items.length-1] = getResources().getStringArray(R.array.frequencies)[getResources().getStringArray(R.array.frequencies).length-1];

        Spinner spinner = findViewById(R.id.frequencyPicker);
        spinner.setOnItemSelectedListener(this);

        this.frequencyAdapter= new ArrayAdapter<>(this, R.layout.spinner_item, items);
        spinner.setAdapter(this.frequencyAdapter);


        if(!lol.equals("NULL")){
            spinner.setSelection(items.length-2);
        }

    }

    @Override
    public void updateFrequencies(String frequency, String type, ArrayList<String> weekdays) {
        this.frequency = frequency;
        this.weekdays = weekdays;
        this.frequencyType = type;
        buildFrequencySpinner(this.frequency + " " + this.frequencyType);
    }

    @Override
    public void noUpdate() {
        buildFrequencySpinner("NULL");

    }


    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {

        if (parent.getItemAtPosition(pos).toString().equals("Custom...") && parent.getId() == R.id.frequencyPicker){
            FrequencyDialogue frequencyDialogue = FrequencyDialogue.newInstance();
            frequencyDialogue.show(getSupportFragmentManager(), "Frequency Dialogue");
        }

        else if(parent.getId() == R.id.frequencyPicker){
            switch(parent.getSelectedItem().toString()){
                case ("Every day"):
                    this.frequency = "1";
                    this.frequencyType = "Day";
                    break;
                case ("Every month"):
                    this.frequency = "1";
                    this.frequencyType = "Month";
                    break;
                case ("Every week"):
                    this.frequency = "1";
                    this.frequencyType = "Week";
                    break;

                case ("Does not repeat"):
                    this.frequency = "0";
                    this.frequencyType = "NULL";
                    break;

                default:
                    String[] oof = parent.getSelectedItem().toString().split(" ");
                    Log.i(TAG,"sdaklsn " + parent.getSelectedItem().toString());
                    this.frequency = oof[0];
                    this.frequencyType = oof[1];
                    break;

            }
            this.weekdays = new ArrayList<>();
        }

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    public void errorCheck(View view){
        boolean valid = true;
        //Check amount

        if (!((TextView)findViewById(R.id.regText)).getText().toString().matches(".*\\d.*")){
            valid = false;
        }


        if (valid == false){
            Toast toast = Toast.makeText(this,"You've got to type in an amount!", Toast.LENGTH_LONG);
            View v = toast.getView();
            v.setBackgroundResource(R.drawable.error_toast);
            ((TextView) v.findViewById(android.R.id.message)).setTextColor(Color.parseColor("#ecf0f1"));
            toast.show();



            ((TextView)findViewById(R.id.textView8)).setTextColor(Color.parseColor("#c0392b"));
            ScrollView scroll = ((ScrollView)findViewById(R.id.scrollView2));
            scroll.postDelayed(new Runnable() {
                @Override
                public void run() {
                    scroll.fullScroll(ScrollView.FOCUS_UP);
                }
            }, 250);
            Animation shake = AnimationUtils.loadAnimation(this, R.anim.shake);
            TextView oof = ((TextView)findViewById(R.id.textView8));
            oof.startAnimation(shake);
        }else{
            callConfirm();
        }

    }

    private void callConfirm(){
        Bundle args = new Bundle();
        args.putString("amount","-"+((TextView)findViewById(R.id.regText)).getText().toString().replace("€",""));
        args.putString("regDate",((TextView)findViewById(R.id.datePicker)).getText().toString());
        args.putString("type","INCOME");
        args.putString("frequency",((Spinner)findViewById(R.id.frequencyPicker)).getSelectedItem().toString());

        if(this.typeFlag==0){
            args.putString("dest","WALLET");
        }else{
            args.putString("dest","CARD");
        }
        ConfirmDialogue confirmDialogue = ConfirmDialogue.newInstance();
        confirmDialogue.setArguments(args);

        confirmDialogue.show(getSupportFragmentManager(), "Confirm Dialogue");
    }

    @Override
    public void confirm() {
        Log.i(TAG,"ola :)");
        registerExpense();
    }

    private void registerExpense(){
        Intent intent = new Intent(this, MainActivity.class);
        EditText editText = (EditText) findViewById(R.id.regText);
        this.amount = Double.parseDouble(editText.getText().toString().replace("€",""))*(-1);
        this.date = ((TextView)findViewById(R.id.datePicker)).getText().toString();


        //Register
        writeFile();
        Calendar cal = Calendar.getInstance();

        if(cal.get(Calendar.DAY_OF_MONTH) == Integer.parseInt(this.date.split("/")[0]) && (cal.get(Calendar.MONTH)+1) == Integer.parseInt(this.date.split("/")[1]) && cal.get(Calendar.YEAR) == Integer.parseInt(this.date.split("/")[2]))
            updateWallet();

        Toast toast = Toast.makeText(this,"Expense Registered Successfully", Toast.LENGTH_LONG);

        toast.show();
        startActivity(intent);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                ExitDialog exitDialog = ExitDialog.newInstance();
                exitDialog.show(getSupportFragmentManager(), "Exit Dialogue");
        }
        return true;
    }
    @Override
    public void exit() {
        finish();
    }

    private void writeFile(){
        boolean found = false;
        for(String i : fileList()){
            Log.v(TAG,i+" ------------------------");
            if(i.equals("UserExpenses.txt")){
                found = true;
                break;
            }
        }

        try{
            FileOutputStream fileOutputStream;
            if(!found) {
                fileOutputStream = openFileOutput("UserExpenses.txt", MODE_PRIVATE);
            }else{
                fileOutputStream = openFileOutput("UserExpenses.txt", MODE_APPEND);
            }

            String type;


            if(this.typeFlag==0){
                type = "WALLET";
            }else{
                type = "CARD";
            }
            //Format: WALLET/CARD - Amount - Register Date - Person (LOANS) - Category(EXPENSES) - FrequencyType - Frequency - Weekdays - Description - PayDate(LOANS) - PAID/NOT PAID (LOANS)
            String description;
            Log.i(TAG,"Boas :) " + ((EditText)findViewById(R.id.editDescription)).getText().toString());
            if(((EditText)findViewById(R.id.editDescription)).getText().toString().equals(""))
                description = "Expense";
            else
                description = ((EditText)findViewById(R.id.editDescription)).getText().toString();
            StringBuilder register = new StringBuilder();
            register.append(type);
            register.append(" - ");
            register.append(amount+"");
            register.append(" - ");
            register.append(this.date);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append(category);
            register.append(" - ");
            register.append(this.frequencyType);
            register.append(" - ");
            register.append(this.frequency);
            register.append(" - ");
            register.append(this.weekdays);
            register.append(" - ");
            register.append(description);
            register.append(" - ");
            if(!this.frequencyType.equals("NULL"))
                register.append(calcNextDate(this.date,this.frequency,this.frequencyType));
            else
                register.append("NULL");
            register.append(" - ");
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            String currentDate = day+"/"+month+"/"+year;
            if(!this.date.equals(currentDate))
                register.append("NOT PAID"+"\n");
            else{
                register.append("PAID"+"\n");
            }

            fileOutputStream.write(register.toString().getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }

    private void updateWallet() {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());

            if(this.typeFlag == 0){
                walletAmount = walletAmount + this.amount;
            }else{
                cardAmount = cardAmount + this.amount;
            }



            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());

            fileOutputStream.close();
            inputStreamReader.close();
            fileInputStream.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
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
