package com.example.changekeeper;

import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.LinearLayout;
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

public class GraphsLoanMoreInfoScreen extends AppCompatActivity implements DeleteDialog.DeleteDialogListener, ConfirmLoanDialog.ConfirmLoanDialogListener {

    private static final String TAG = "Loans";

    private String info;
    private  String[] details;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        this.info = intent.getStringExtra(RecyclerViewAdapter.EXTRA_MESSAGE);
        details = this.info.split( " - ");

        ActionBar toolbar = getSupportActionBar();
        setContentView(R.layout.layout_more_dialogue_loans);



        toolbar.setTitle("More Loan Details");

        //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description

        TextView text = findViewById(R.id.amountText);
        text.setText(details[1] + "€");


        if(details[1].contains("-")){
            text.setTextColor(Color.parseColor("#e74c3c"));
            ImageButton butt = (ImageButton)findViewById(R.id.payButton);
            butt.setImageResource(R.drawable.ic_income);
        }else{
            text.setTextColor(Color.parseColor("#2ecc71"));
            ImageButton butt = (ImageButton)findViewById(R.id.payButton);
            butt.setImageResource(R.drawable.ic_expense);
        }

        if(details[10].equals("PAID")){
            LinearLayout ll;
            ll = (LinearLayout) findViewById(R.id.verticalLayout);
            if(findViewById(R.id.payButton) != null)
                ll.removeView(findViewById(R.id.payButton));
        }
        text = findViewById(R.id.descriptionText);
        text.setText(details[8]);

        text = findViewById(R.id.fromInput);
        text.setText(details[2]);

        text = findViewById(R.id.destText);
        text.setText(details[0]);

        text = findViewById(R.id.person);
        text.setText(details[3]);

        text = findViewById(R.id.payDay);
        text.setText(details[9]);

        if(details[1].contains("-")){
            text = findViewById(R.id.typeText);
            text.setText("Lent");
        }else{
            text = findViewById(R.id.typeText);
            text.setText("Borrowed");
        }



    }


    private ArrayList<String> readFile() {
        try {
            if (!this.details[1].contains("-")) {
                FileInputStream fileInputStream = openFileInput("UserBorrows.txt");
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                ArrayList<String> ourRegs = new ArrayList<>();
                String line;
                boolean found = false;

                //Format: ID - WALLET/CARD - Amount - Person - Date - Description
                while ((line = bufferedReader.readLine()) != null) {
                    if(!found && line.equals(this.info)){
                        found = true;
                        continue;
                    }
                    ourRegs.add(line);

                }

                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
                return ourRegs;
            } else {
                FileInputStream fileInputStream = openFileInput("UserLends.txt");
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                ArrayList<String> ourRegs = new ArrayList<>();

                String line;
                boolean found = false;

                //Format: ID - WALLET/CARD - Amount - Person - Date - Description
                while ((line = bufferedReader.readLine()) != null) {

                    if(!found && line.equals(this.info)){
                        found = true;
                        continue;
                    }

                    ourRegs.add(line);
                }

                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
                return ourRegs;

            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private ArrayList<String> readFile2() {
        try {
            if (!this.details[1].contains("-")) {
                FileInputStream fileInputStream = openFileInput("UserBorrows.txt");
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                ArrayList<String> ourRegs = new ArrayList<>();
                String line;
                boolean found = false;

                //Format: ID - WALLET/CARD - Amount - Person - Date - Description
                while ((line = bufferedReader.readLine()) != null) {
                    if(!found && line.equals(this.info)){
                        found = true;
                        line =  line.split(" - ")[0] + " - " +
                                line.split(" - ")[1] + " - " +
                                line.split(" - ")[2] + " - " +
                                line.split(" - ")[3] + " - " +
                                line.split(" - ")[4] + " - " +
                                line.split(" - ")[5] + " - " +
                                line.split(" - ")[6] + " - " +
                                line.split(" - ")[7] + " - " +
                                "[PAID] " + line.split(" - ")[8] + " - " +
                                line.split(" - ")[9] + " - " +
                                "PAID";

                    }
                    ourRegs.add(line);
                }

                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
                return ourRegs;
            } else {
                FileInputStream fileInputStream = openFileInput("UserLends.txt");
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                ArrayList<String> ourRegs = new ArrayList<>();

                String line;
                boolean found = false;
                //Format: ID - WALLET/CARD - Amount - Person - Date - Description
                while ((line = bufferedReader.readLine()) != null) {

                    if(!found && line.equals(this.info)){
                        found = true;
                        Calendar cal = Calendar.getInstance();
                        int year = cal.get(Calendar.YEAR);
                        int month = cal.get(Calendar.MONTH) + 1;
                        int day = cal.get(Calendar.DAY_OF_MONTH);
                        line =  line.split(" - ")[0] + " - " +
                                line.split(" - ")[1] + " - " +  //Make the value negative
                                line.split(" - ")[2] + " - " +
                                line.split(" - ")[3] + " - " +
                                line.split(" - ")[4] + " - " +
                                line.split(" - ")[5] + " - " +
                                line.split(" - ")[6] + " - " +
                                line.split(" - ")[7] + " - " +
                                "[PAID] " + line.split(" - ")[8] + " - " +
                                day+"/"+month+"/"+year + " - " +
                                "PAID";

                    }
                    ourRegs.add(line);
                }

                bufferedReader.close();
                inputStreamReader.close();
                fileInputStream.close();
                return ourRegs;

            }
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

        String message = "Loan deleted successfully!";

        Toast toast = Toast.makeText(this,message, Toast.LENGTH_LONG);
        toast.show();
        startActivity(intent);
    }




    public void payThis(View view) throws IOException {
        Bundle args = new Bundle();
        if (details[1].contains("-")) {
            args.putString("type", "lend");
            args.putString("amount", ((TextView) findViewById(R.id.amountText)).getText().toString().replace("€", "").replace("-",""));

        } else {
            args.putString("type", "borrow");
            args.putString("amount", "-"+((TextView) findViewById(R.id.amountText)).getText().toString().replace("€", ""));

        }
        args.putString("person", ((TextView) findViewById(R.id.person)).getText().toString());


        ConfirmLoanDialog confirmDialogue = ConfirmLoanDialog.newInstance();
        confirmDialogue.setArguments(args);

        confirmDialogue.show(getSupportFragmentManager(), "Confirm Dialogue");
    }

    private void registerIncome(String dest) throws IOException {
        boolean found = false;
        for(String i : fileList()){
            Log.v(TAG,i+" ------------------------");
            if(i.equals("UserIncomes.txt")){
                found = true;
                break;
            }
        }

        try{
            FileOutputStream fileOutputStream;
            if(!found) {
                fileOutputStream = openFileOutput("UserIncomes.txt", MODE_PRIVATE);
            }else{
                fileOutputStream = openFileOutput("UserIncomes.txt", MODE_APPEND);
            }

            String type;


            if(dest.equals("WALLET")){
                type = "WALLET";
            }else{
                type = "CARD";
            }
            //Format: ID - WALLET/CARD - Amount - Date - Person(NULL) - Category(NULL) - FrequencyType - Frequency - Weekdays - Description

            StringBuilder register = new StringBuilder();
            register.append(type);
            register.append(" - ");
            register.append(this.details[1].replace("-","")+"");
            register.append(" - ");
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            register.append(day+"/"+month+"/"+year);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("Debt paid by "+this.details[3]);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("PAID" + "\n");

            fileOutputStream.write(register.toString().getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }


    private void registerExpense(String dest){
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

            if(dest.equals("WALLET")){
                type = "WALLET";
            }else{
                type = "CARD";
            }

            //Format: ID - WALLET/CARD - Amount - Date - Person(NULL) - Category - FrequencyType - Frequency - Weekdays - Description

            StringBuilder register = new StringBuilder();
            register.append(type);
            register.append(" - ");
            register.append("-"+this.details[1]+"");
            register.append(" - ");
            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            register.append(day+"/"+month+"/"+year);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("Debt payment");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("Debt paid to "+this.details[3]);
            register.append(" - ");
            register.append("NULL");
            register.append(" - ");
            register.append("PAID" + "\n");

            fileOutputStream.write(register.toString().getBytes());
            fileOutputStream.close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }
    private void updateFile(ArrayList<String> newList) throws IOException {
        FileOutputStream fileOutputStream;
        if (!this.details[1].contains("-")) {
            fileOutputStream = openFileOutput("UserBorrows.txt", MODE_PRIVATE);
        }else{
            fileOutputStream = openFileOutput("UserLends.txt", MODE_PRIVATE);
        }

        for(int k = 0 ; k < newList.size() ; k++){
            fileOutputStream.write((newList.get(k)+"\n").getBytes());
        }

        fileOutputStream.close();

    }

    private void updateWallet(String dest) {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());

            Log.i("FDS DUDE CRL", "L " + this.details[1]);

            if(dest.equals("WALLET"))
                walletAmount = walletAmount - Double.parseDouble(this.details[1]);
            else
                cardAmount = cardAmount - Double.parseDouble(this.details[1]);



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

    @Override
    public void pay(String dest) {
        updateWallet(dest);
        try {
            updateFile(readFile2());
        } catch (IOException e) {
            e.printStackTrace();
        }
        Intent intent = new Intent(this, MainActivity.class);

        String message;
        if (this.details[1].contains("-")) {
            message = this.details[3] + " paid their debt successfully!";
            try {
                registerIncome(dest);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else {
            message = "You paid your debt to " + this.details[3] + " successfully!";
            registerExpense(dest);
        }
        Toast toast = Toast.makeText(this,message, Toast.LENGTH_LONG);
        toast.show();
        startActivity(intent);
    }
}
