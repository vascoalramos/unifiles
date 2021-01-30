package com.example.changekeeper;

import android.content.Intent;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;

import android.support.v4.app.FragmentManager;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Calendar;

public class MainActivity extends AppCompatActivity implements TransferDialog.TransferDialogListener, ConfirmDialogue2.ConfirmDialogListener2 {

    public static final String EXTRA_MESSAGE = "com.example.MainActivity.MESSAGE";
    private static final String TAG = "MainAct";
    private static boolean sync = false;

    private ActionBar toolbar;

    public ViewPager mPager;
    private PagerAdapter pageAdapter;
    private static final int NUM_PAGES = 2;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        boolean found = false;

        for(String i : fileList()){
            Log.v(TAG,i+" ------------------------");
            if(i.equals("UserMoney.txt")){
                found = true;
                break;
            }
        }

        if(!found)
            startActivity(new Intent(this, IntroActivity.class));
        else if(!sync){
            syncInfo();
            sync = true;
        }

        toolbar = getSupportActionBar();
        toolbar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
        toolbar.setDisplayShowCustomEnabled(true);
        toolbar.setCustomView(R.layout.layout_actionbar);
        ((TextView)toolbar.getCustomView().findViewById(R.id.ourTitle)).setText("ChangeKeeper");

        ImageButton butt  = toolbar.getCustomView().findViewById(R.id.settings);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                Intent intent = new Intent(v.getContext(), SettingsScreen.class);
                startActivity(intent);
            }
        });

        this.mPager = (ViewPager) findViewById(R.id.typeSelector);
        this.pageAdapter = new ScreenSlidePagerAdapter(getSupportFragmentManager());
        this.mPager.setAdapter(pageAdapter);

        this.mPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            public void onPageScrollStateChanged(int state) {}
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {}

            public void onPageSelected(int position) {
                if (position == 0 ){
                    TextView view = (TextView) findViewById(R.id.transferText);
                    view.setText("Transfer to Card");
                    findViewById(R.id.transferToCardButton).setScaleX(1);
                    findViewById(R.id.transferToCardButton).animate().rotation(180).start();

                }else{
                    TextView view = (TextView) findViewById(R.id.transferText);
                    view.setText("Transfer to Wallet");
                    findViewById(R.id.transferToCardButton).setScaleX(-1);
                    findViewById(R.id.transferToCardButton).animate().rotation(-180).start();

                }
            }
        });

        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setSelectedItemId(R.id.navigation_home);
        navigation.setOnNavigationItemSelectedListener((item) -> {
            switch (item.getItemId()) {
                case R.id.navigation_subscriptions:
                    startActivity(new Intent(this, SubscriptionScreen.class));
                    return true;
                case R.id.navigation_allowances:
                    startActivity(new Intent(this, AllowanceScreen.class));
                    return true;
                case R.id.navigation_home:
                    return true;
                case R.id.navigation_loans:
                    startActivity(new Intent(this, LoanScreen.class));
                    return true;
                case R.id.navigation_info:
                    startActivity(new Intent(this, GraphsScreen.class));
                    return true;
            }
            return false;
        });

        Log.v(TAG,"HELLOOOOOOOOOOOOOOOOOOOOOOOO :D");

    }


    public void changeView(){
        if(mPager.getCurrentItem()==0){
            mPager.setCurrentItem(1);
        }else{
            mPager.setCurrentItem(0);
        }
    }

    @Override
    public void onBackPressed() {
        if (mPager.getCurrentItem() == 0) {
            // If the user is currently looking at the first step, allow the system to handle the
            // Back button. This calls finish() on this activity and pops the back stack.
            super.onBackPressed();
        } else {
            // Otherwise, select the previous step.
            mPager.setCurrentItem(mPager.getCurrentItem() - 1);
        }
    }

    @Override
    public void confirm(String amount) {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());



            inputStreamReader.close();
            fileInputStream.close();

            amount = amount.replace("€","");
            Toast toast;
            switch(((TextView) findViewById(R.id.transferText)).getText().toString()){
                case "Transfer to Card":
                    walletAmount = walletAmount - Double.parseDouble(amount);
                    cardAmount = cardAmount + Double.parseDouble(amount);
                    toast = Toast.makeText(this,"Money transferred from wallet to card successfully!", Toast.LENGTH_LONG);
                    toast.show();
                    break;
                case "Transfer to Wallet":
                    walletAmount = walletAmount + Double.parseDouble(amount);
                    cardAmount = cardAmount - Double.parseDouble(amount);
                    toast = Toast.makeText(this,"Money transferred from card to wallet successfully!", Toast.LENGTH_LONG);
                    toast.show();
                    break;
            }

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();

            ((ScreenSlidePagerAdapter) this.pageAdapter).updateWallet();
            ((ScreenSlidePagerAdapter) this.pageAdapter).updateCard();
            int current = this.mPager.getCurrentItem();
            this.mPager.setAdapter(pageAdapter);
            this.mPager.setCurrentItem(current);



        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private class ScreenSlidePagerAdapter extends FragmentStatePagerAdapter {
        private Fragment walletFrag;
        private Fragment cardFrag;

        public ScreenSlidePagerAdapter(FragmentManager fm) {
            super(fm);
            this.walletFrag = new MainWalletFragment();
            this.cardFrag = new MainCardFragment();
        }

        @Override
        public Fragment getItem(int position) {
            if (position == 0)
                return this.walletFrag;
            else
                return this.cardFrag;
        }

        public void updateWallet(){
            ((MainWalletFragment) this.walletFrag).updateAmount();
        }

        public void updateCard(){
            ((MainCardFragment) this.cardFrag).updateAmount();
        }

        @Override
        public int getCount() {
            return NUM_PAGES;
        }


    }


    public void goToExpense(View view){
        if (mPager.getCurrentItem() == 0) {
            Intent intent = new Intent(this, RegExpenseScreen.class);
            String message = "EXPENSE-WALLET";
            intent.putExtra(EXTRA_MESSAGE, message);
            startActivity(intent);
        }else{
            Intent intent = new Intent(this, RegExpenseScreen.class);
            String message = "EXPENSE-CARD";
            intent.putExtra(EXTRA_MESSAGE, message);
            startActivity(intent);
        }
    }


    public void goToIncome(View view){
        if (mPager.getCurrentItem() == 0) {
            Intent intent = new Intent(this, RegIncomeScreen.class);
            String message = "INCOME-WALLET";
            intent.putExtra(EXTRA_MESSAGE, message);
            startActivity(intent);
        }else{
            Intent intent = new Intent(this, RegIncomeScreen.class);
            String message = "INCOME-CARD";
            intent.putExtra(EXTRA_MESSAGE, message);
            startActivity(intent);
        }
    }


    public void openTransferDialogue(View view){
        TransferDialog transferDialog = TransferDialog.newInstance();
        transferDialog.show(getSupportFragmentManager(), "Transfer Dialogue");
    }

    public void updateAmounts(String amount,String destination){
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());



            inputStreamReader.close();
            fileInputStream.close();

            amount = amount.replace("€","");

            switch(destination){
                case "WALLET":
                    walletAmount = walletAmount + Double.parseDouble(amount);
                    break;
                case "CARD":
                    cardAmount = cardAmount + Double.parseDouble(amount);
                    break;
            }

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateTransfer(String amount) {
        try {
            FileInputStream fileInputStream = openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            Double walletAmount = Double.parseDouble(bufferedReader.readLine());
            Double cardAmount = Double.parseDouble(bufferedReader.readLine());



            inputStreamReader.close();
            fileInputStream.close();

            amount = amount.replace("€","");

            switch(((TextView) findViewById(R.id.transferText)).getText().toString()){
                case "Transfer to Card":
                    walletAmount = walletAmount - Double.parseDouble(amount);
                    cardAmount = cardAmount + Double.parseDouble(amount);
                    break;
                case "Transfer to Wallet":
                    walletAmount = walletAmount + Double.parseDouble(amount);
                    cardAmount = cardAmount - Double.parseDouble(amount);
                    break;
            }

            FileOutputStream fileOutputStream = openFileOutput("UserMoney.txt", MODE_PRIVATE);
            fileOutputStream.write((walletAmount+"\n").getBytes());
            fileOutputStream.write((cardAmount+"\n").getBytes());
            fileOutputStream.close();

            ((ScreenSlidePagerAdapter) this.pageAdapter).updateWallet();
            ((ScreenSlidePagerAdapter) this.pageAdapter).updateCard();
            int current = this.mPager.getCurrentItem();
            this.mPager.setAdapter(pageAdapter);
            this.mPager.setCurrentItem(current);


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void syncInfo(){
        Toast toast = Toast.makeText(this,"Checking for scheduled transactions", Toast.LENGTH_LONG);
        toast.show();

        boolean inc = updateFile("UserIncomes");
        boolean exp = updateFile("UserExpenses");
        boolean deb = updateFile("UserBorrows");
        boolean loan = updateFile("UserLends");

        if(inc || exp || deb || loan){
            String t = "New ";
            if(inc)
                t = t+"Incomes, ";
            if(exp)
                t = t+"Expenses ";
            if(deb)
                t = t + "Debt payments, ";
            if(loan)
                t = t + "Loan payments, ";

            t = t + "have been registered!";

            toast = Toast.makeText(this,t, Toast.LENGTH_LONG);
            toast.show();
        }else{
            toast = Toast.makeText(this,"There aren't any new scheduled transactions for today!", Toast.LENGTH_LONG);
            toast.show();
        }
    }

    private boolean updateFile(String file) {
        boolean test = false;
        try {
            FileInputStream fileInputStream = openFileInput(file+".txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            ArrayList<String> all = new ArrayList<>();
            String line;

            //Format: WALLET/CARD - Amount - Date - Person(NULL UNLESS LOAN) - Category (NULL UNLESS EXPENSE)- FrequencyType (NULL IF LOAN) - Frequency (NULL IF LOAN) - Weekdays (NULL IF LOAN) - Description
            while((line = bufferedReader.readLine()) != null){
                Log.i("FADFASKD", "SDOF" + line);

                if(!line.split(" - ")[9].equals("NULL")) { //Check if theres a pay date

                    Calendar cal = Calendar.getInstance();
                    int year = cal.get(Calendar.YEAR);
                    int month = cal.get(Calendar.MONTH) + 1;
                    int day = cal.get(Calendar.DAY_OF_MONTH);
                    String currentDate = day + "/" + month + "/" + year;

                    String[] temp = line.split(" - ");


                    Calendar cal2 = Calendar.getInstance();
                    cal2.set(Calendar.YEAR, Integer.parseInt(temp[9].split("/")[2]));
                    cal2.set(Calendar.MONTH, Integer.parseInt(temp[9].split("/")[1]) - 1);
                    cal2.set(Calendar.DAY_OF_MONTH, Integer.parseInt(temp[9].split("/")[0]));
                    int year2 = cal.get(Calendar.YEAR);
                    int month2 = cal.get(Calendar.MONTH) + 1;
                    int day2 = cal.get(Calendar.DAY_OF_MONTH);
                    String nextDate = day2 + "/" + month2 + "/" + year2;

                    Log.i("o","ohm" + nextDate);
                    if (!file.equals("UserBorrows") && !file.equals("UserLends")) { //For Incomes/Expenses
                        if(cal.after(cal2)){
                            Log.i(TAG,"oioi" + line);
                            updateAmounts(temp[1],temp[0]);

                            temp[10] = "PAID";
                            line = temp[0] + " - " +
                                    temp[1] + " - " +
                                    temp[2] + " - " +
                                    temp[3] + " - " +
                                    temp[4] + " - " +
                                    temp[5] + " - " +
                                    temp[6] + " - " +
                                    temp[7] + " - " +
                                    temp[8] + " - " +
                                    calcNextDate(temp[9],temp[6],temp[5]) + " - " +
                                    temp[10];
                            test = true;
                        }
                    }else{
                        if(!temp[10].equals("PAID") && (cal.after(cal2) || cal.toString().equals(cal2.toString()))){
                            Log.i(TAG,"oioi" + line);
                            updateAmounts(temp[1],temp[0]);

                            line =  temp[0] + " - " +
                                    temp[1] + " - " +
                                    temp[2] + " - " +
                                    temp[3] + " - " +
                                    temp[4] + " - " +
                                    temp[5] + " - " +
                                    temp[6] + " - " +
                                    temp[7] + " - " +
                                    "[PAID] "+ temp[8] + " - " +
                                    temp[9] + " - " +
                                    "PAID";
                            test = true;
                        }
                    }


                    Log.i("Of", "ansf " + line);
                }
                all.add(line);
                /*for (String i : this.all)
                    Log.i(TAG,"oof " + i);*/
            }

            bufferedReader.close();

            FileOutputStream fileOutputStream = openFileOutput(file+".txt", MODE_PRIVATE);
            for(String i : all)
                fileOutputStream.write((i+"\n").getBytes());
            fileOutputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return test;
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
                        continue;
                    cal.add(Calendar.DAY_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Week":
                do {
                    if(cal.equals(current))
                        continue;
                    cal.add(Calendar.WEEK_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Month":
                do {
                    if(cal.equals(current))
                        continue;
                    cal.add(Calendar.MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Year":
                do {
                    if(cal.equals(current))
                        continue;
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
