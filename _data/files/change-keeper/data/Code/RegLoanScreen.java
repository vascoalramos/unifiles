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
import java.util.Calendar;

public class RegLoanScreen extends AppCompatActivity implements AdapterView.OnItemSelectedListener, ConfirmDialogue.ConfirmDialogListener, ExitDialog.ExitDialogListener {

    private static final String TAG = "RegLoan";
    private TextView mDisplayDate;
    private DatePickerDialog.OnDateSetListener mDateSetListener;
    private int typeFlag;
    private ArrayAdapter<String> destinationAdapter;


    //To save:
    //Amount
    private double amount;

    //Destination (card or wallet);
    private String destination;

    //From
    private String person;

    //Date
    private String date;

    //Description
    private String description;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String message = intent.getStringExtra(MainActivity.EXTRA_MESSAGE);

        ActionBar toolbar = getSupportActionBar();
        setContentView(R.layout.activity_reg_loan_screen_temp);



        switch(message){
            case "BORROW":
                this.typeFlag = 0;
                ((TextView)findViewById(R.id.typeText4)).setText("Borrow");
                ((TextView)findViewById(R.id.textView10)).setText("From");
                toolbar.setTitle("Borrow money");

                break;

            case "LEND":
                this.typeFlag = 1;
                ((TextView)findViewById(R.id.typeText4)).setText("Lend");
                ((TextView)findViewById(R.id.textView10)).setText("To");
                toolbar.setTitle("Lend money");


                break;

            default:
                Log.v(TAG,"wtf erro :D");
        }

        Log.v(TAG,"OLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

        //Date
        mDisplayDate = (TextView) findViewById(R.id.datePicker);
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH)+1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        mDisplayDate.setText(day+"/"+month+"/"+year);

        mDisplayDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Calendar cal = Calendar.getInstance();
                int year = cal.get(Calendar.YEAR);
                int month = cal.get(Calendar.MONTH);
                int day = cal.get(Calendar.DAY_OF_MONTH);

                DatePickerDialog dialog = new DatePickerDialog(
                        RegLoanScreen.this,
                        android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                        mDateSetListener,
                        year,month,day);
                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.show();
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

        //Destination Dropwdown
        buildDestinationSpinner();

    }

    @Override
    public void onBackPressed() {
        ExitDialog exitDialog = ExitDialog.newInstance();
        exitDialog.show(getSupportFragmentManager(), "Exit Dialogue");
    }

    private void buildDestinationSpinner(){
        String[] items = {"WALLET","CARD"};
        Spinner spinner = findViewById(R.id.destination);
        spinner.setOnItemSelectedListener(this);

        this.destinationAdapter= new ArrayAdapter<>(this, R.layout.spinner_item, items);
        spinner.setAdapter(this.destinationAdapter);

    }


    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {
         this.destination = parent.getSelectedItem().toString();
        if(this.destination.equals("WALLET"))
            ((ImageView)findViewById(R.id.imageView)).setImageResource(R.drawable.ic_walletback);
        else
            ((ImageView)findViewById(R.id.imageView)).setImageResource(R.drawable.ic_cardback);

    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }


    public void errorCheck(View view){
        boolean valid = true;
        //Check amount

        if (((TextView)findViewById(R.id.regText)).getText().length() == 0){
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
            }, 300);
            Animation shake = AnimationUtils.loadAnimation(this, R.anim.shake);
            TextView oof = ((TextView)findViewById(R.id.textView8));
            oof.startAnimation(shake);


        }else{
            callConfirm();
        }

    }

    private void callConfirm(){
        Bundle args = new Bundle();
        String amount = "";
        switch(this.typeFlag){
            case 0:
                args.putString("type","BORROW");
                amount = ((TextView)findViewById(R.id.regText)).getText().toString().replace("€","");
                break;

            case 1:
                args.putString("type","LEND");
                amount = "-" + ((TextView)findViewById(R.id.regText)).getText().toString().replace("€","");
                break;

            default:
                Log.v(TAG,"wtf erro :D");
        }
        args.putString("amount",amount);

        switch(this.destination){
            case "WALLET":
                args.putString("dest","WALLET");
                break;

            case "CARD":
                args.putString("dest","CARD");
                break;

            default:
                Log.v(TAG,"wtf erro :D");
        }

        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);

        args.putString("regDate",day+"/"+month+"/"+year);
        args.putString("payday",((TextView)findViewById(R.id.datePicker)).getText().toString());

        ConfirmDialogue confirmDialogue = new ConfirmDialogue();
        confirmDialogue.setArguments(args);
        confirmDialogue.show(getSupportFragmentManager(), "Confirm Dialogue");
    }

    @Override
    public void confirm() {
        registerLoan();
    }

    private void registerLoan(){
        Intent intent = new Intent(this, LoanScreen.class);
        EditText editText = (EditText) findViewById(R.id.regText);

        this.amount = Double.parseDouble(editText.getText().toString().replace("€",""));
        Log.i(TAG,"oioi"+this.amount);
        this.date = ((TextView)findViewById(R.id.datePicker)).getText().toString();
        if(((TextView)findViewById(R.id.fromInput)).getText().toString().length() == 0)
            this.person = "Anonymous";
        else
            this.person = ((TextView)findViewById(R.id.fromInput)).getText().toString();

        if(((TextView)findViewById(R.id.editDescription)).getText().toString().length() == 0)
            if(this.typeFlag == 1)
                this.description = "Lent money to " + this.person;
            else
                this.description = "Borrowed money from " + this.person;
        else
            this.description = ((TextView)findViewById(R.id.editDescription)).getText().toString();

        //Register
        writeFile();
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);

        Log.i(TAG,"oioi" + this.date);
        updateWallet();

        Toast toast = Toast.makeText(this,"Loan Registered Successfully", Toast.LENGTH_SHORT);

        toast.show();
        startActivity(intent);
    }

    private void writeFile(){
        boolean found = false;

        String fileName = "";
        switch(this.typeFlag){
            case 0:
               fileName = "UserBorrows";
                break;

            case 1:
                fileName = "UserLends";
                this.amount = this.amount*(-1);
                break;

            default:
                Log.v(TAG,"wtf erro :D");
        }

        for(String i : fileList()){
            Log.v(TAG,i+" ------------------------");
            if(i.equals(fileName+".txt")){
                found = true;
                break;
            }
        }

        try{
            FileOutputStream fileOutputStream;
            if(!found) {
                fileOutputStream = openFileOutput(fileName+".txt", MODE_PRIVATE);
            }else{
                fileOutputStream = openFileOutput(fileName+".txt", MODE_APPEND);
            }

            //Format: WALLET/CARD - Amount - Register Date - Person (LOANS) - Category(EXPENSES) - FrequencyType - Frequency - Weekdays - Description - PayDate(LOANS) - PAID/NOT PAID (LOANS)

            StringBuilder register = new StringBuilder();
            register.append(this.destination);
            register.append(" - ");
            register.append(this.amount+"");
            register.append(" - ");
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            register.append(day+"/"+month+"/"+year);
            register.append(" - ");
            register.append(this.person);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append(this.description);
            register.append(" - ");
            register.append(this.date);
            register.append(" - ");
            register.append("NOT PAID"+"\n");

            fileOutputStream.write(register.toString().getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }
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
    private void updateWallet() {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());


                if(this.destination.equals("WALLET"))
                    walletAmount = walletAmount + this.amount;
                else
                    cardAmount = cardAmount + this.amount;



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



}

