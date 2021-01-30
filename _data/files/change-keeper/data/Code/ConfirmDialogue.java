package com.example.changekeeper;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatDialogFragment;
import android.text.InputType;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Calendar;

public class ConfirmDialogue extends AppCompatDialogFragment{
    //Class used to confirm
    private String walletAmount;
    private String cardAmount;
    private String current;
    private String amount;
    private ConfirmDialogListener listener;

    static ConfirmDialogue newInstance() {
        return new ConfirmDialogue();
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.i("boi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_confirm_dialogue,null);



        readFile();
        Bundle args = getArguments();

        switch(args.getString("dest")){
            case "WALLET":
                ((TextView)view.findViewById(R.id.currentText)).setText("Current money in Wallet:");
                this.current = this.walletAmount;
                break;
            case "CARD":
                ((TextView)view.findViewById(R.id.currentText)).setText("Current money in Card:");
                this.current = this.cardAmount;
                break;
        }

        switch(args.getString("type")){
            case "EXPENSE":
                if(!args.getString("frequency").split(" ")[0].equals("Every") && !args.getString("frequency").equals("Does not repeat"))
                    ((TextView)view.findViewById(R.id.frequencyText)).setText("Every " + args.getString("frequency"));
                else
                    ((TextView)view.findViewById(R.id.frequencyText)).setText(args.getString("frequency"));

                break;
            case "INCOME":
                if(!args.getString("frequency").split(" ")[0].equals("Every") && !args.getString("frequency").equals("Does not repeat"))
                    ((TextView)view.findViewById(R.id.frequencyText)).setText("Every " + args.getString("frequency"));
                else
                    ((TextView)view.findViewById(R.id.frequencyText)).setText(args.getString("frequency"));
                break;
            default:
                ((TextView)view.findViewById(R.id.ammountText3)).setText("Payday:");
                ((TextView)view.findViewById(R.id.frequencyText)).setText(args.getString("payday"));
                break;

        }
        this.amount = args.getString("amount");
        Log.i(":(","fds wtfcrl " + this.amount);

        if(Double.parseDouble(amount)>0){
            ((TextView)view.findViewById(R.id.registered)).setText("+"+amount + "€");
            ((TextView)view.findViewById(R.id.registered)).setTextColor(Color.parseColor("#2ecc71"));

        }
        else{
            ((TextView)view.findViewById(R.id.registered)).setText(amount + "€");
            ((TextView)view.findViewById(R.id.registered)).setTextColor(Color.parseColor("#e74c3c"));
        }

        ((TextView)view.findViewById(R.id.current)).setText(current + "€");

        if(Double.parseDouble(current)>0)
            ((TextView)view.findViewById(R.id.current)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)view.findViewById(R.id.current)).setTextColor(Color.parseColor("#e74c3c"));

        double finalAmount = 0;
        finalAmount = Double.parseDouble(this.current) + Double.parseDouble(this.amount);

        Log.i("hm","FDSOI" + finalAmount);
        ((TextView)view.findViewById(R.id.moneyAfter)).setText(finalAmount + "€");

        if(finalAmount>0)
            ((TextView)view.findViewById(R.id.moneyAfter)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)view.findViewById(R.id.moneyAfter)).setTextColor(Color.parseColor("#e74c3c"));

        try{
            String date = args.getString("regDate");
            Calendar cal = Calendar.getInstance();
            Calendar cal2 = Calendar.getInstance();
            cal2.set(Calendar.YEAR,Integer.parseInt(date.split("/")[2]));
            cal2.set(Calendar.MONTH,Integer.parseInt(date.split("/")[1])-1);
            cal2.set(Calendar.DAY_OF_MONTH,Integer.parseInt(date.split("/")[0]));

            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH) + 1;
            int day = cal.get(Calendar.DAY_OF_MONTH);
            String currentDate = day+"/"+month+"/"+year;

            if(!date.equals(currentDate) && cal2.after(cal)){
                TextView warning = view.findViewById(R.id.moneyAlter);
                warning.setText("*Transaction will only occur in " + date);
                warning.setVisibility(View.VISIBLE);
            }
        }catch(Exception e){}

        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                listener.confirm();
            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (ConfirmDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement CategoryDialogueListener"));
        }
    }

    public interface ConfirmDialogListener{
        void confirm();
    }


    private void readFile() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            this.walletAmount = bufferedReader.readLine();
            this.cardAmount = bufferedReader.readLine();

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


